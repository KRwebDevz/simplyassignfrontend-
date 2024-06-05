"use client";
import React, { ReactNode, useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FileIcon from "@/components/FileIcon";
import Options from "@/components/Options";
import "../css/icon.modules.css";
import TaskTable from "@/components/task/TaskTable";
import toast, { Toaster } from "react-hot-toast";
import TaskDetailsModal from "@/components/TaskDetail/TaskDetailsModal";
import Chat from "@/components/Chat";
import axios from "axios";
import { headers } from "next/headers";
import { useAuth } from "@/context/AuthContext";
import AdminTaskTable from "@/components/task/AdminTaskTable";

interface Assigned {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  _id: string;
  roll_no: string;
}

interface assignedBy {  
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  _id: string;
  roll_no: string;
}


interface Task {
  id: string;
  title: string;
  _id: string;
  Task: string;
  owner: string;
  status: string;
  assignes: string[];
  Deadline: string | null;
  description: string;
  deadline: string;
  assigned: Assigned;
  assignedBy: assignedBy;
  fileLocations: string[];
  subassigned: {
    _id: string;
    first_name: string;
    last_name: string;
    roll_no: string;
  } | null;
  updatedDeadline: string;
  PricipleStatus: string;
}

interface Log {
  _id: string;
  log: string;
  user: User | null;
  task: Task;
  date: string;
  __v: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  roll_no: string;
}

interface FilterUser {
  id: string;
  name: string;
  roll_no: string;
}

const Page: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState("Not Started");
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>();
  const [search, setSearch] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("");
  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [usernameFilter, SetUsernameFilter] = useState("");
  const [filterApplied, setFilterAppilied] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>(""); // State for selected user
  const [originalAdminTasks, setOriginalAdminTasks] = useState<Task[]>([]);
  const [selectedOption, setSelectedOption] = useState("assigned to you");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (filterApplied === false) {
      setStatusFilter("");
      SetUsernameFilter("");
      setSort("");
      fetchTasks();
    }
  }, [filterApplied]);

  const filterUser: FilterUser[] = tasks.map((task: Task) => {
    return {
      id: task?.assigned?._id,
      roll_no: task?.assigned?.roll_no,
      name: task?.assigned?.first_name + " " + task?.assigned?.last_name,
    };
  });

  const filterUserUnique: FilterUser[] = filterUser.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
  );

  useEffect(() => {
    if (statusFilter) {
      filterTaskSubmit();
    }
  }, [statusFilter]);

  const { user } = useAuth();

  const filterTaskSubmit = async () => {
    try {
      if (!usernameFilter && !statusFilter && !sort) {
        toast.error("Select a filter");
        return;
      }

      const baseApi = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/filter-task`;
      const baseAdminApi = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/filter-tasks-by-admin`;
      const queryParams = [];

      if (statusFilter) queryParams.push(`status=${statusFilter}`);
      if (usernameFilter) queryParams.push(`userID=${usernameFilter}`);
      if (sort) queryParams.push(`sort=${sort}`);

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

      const api = baseApi + queryString;
      const adminApi = baseAdminApi + queryString;

      console.log("API URL:", api);
      console.log("Admin API URL:", adminApi);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(api, {}, { headers });
      const adminResponse = await axios.post(adminApi, {}, { headers });

      if (response.status === 200) {
        console.log("User Response Data:", response.data);
        setTasks(response.data.tasks);
        setFilterAppilied(true);
      }

      if (adminResponse.status === 200) {
        console.log("Admin Response Data:", adminResponse.data);
        setAdminTasks(adminResponse.data.tasks);
        setOriginalAdminTasks(adminResponse.data.tasks);
        setFilterAppilied(true);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const adminfetchTasks = async () => {
    try {
      const adminTasksResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/get-task-by-admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setAdminTasks(adminTasksResponse.data.tasks);
      setOriginalAdminTasks(adminTasksResponse.data.tasks); // Update original tasks
      console.log(adminTasksResponse.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      adminfetchTasks();
    }
  }, [user]);

  const handlePrincipleStatusChange = (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/change-status-principle/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      ).then((response) => {
        if (response.ok) {
          console.log("Task status updated successfully");
          toast.success("Task status updated successfully");
          fetchTasks();
          if (user && user.role === "admin") {
            adminfetchTasks();
          }
        } else {
          console.error("Error updating task status:", response.statusText);
          toast.error("Error updating task status");
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchLogs = async (task: Task) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logs/get-logs/${task._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      console.log("admin status changed");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/change-status/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (response.ok) {
        console.log("Task status updated successfully");
        toast.success("Task status updated successfully");
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task,
          ),
        );
        if (user && user.role === "admin") {
          adminfetchTasks();
        }
      } else {
        console.error("Error updating task status:", response.statusText);
        toast.error("Error updating task status:");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const usersData = data.map((user: any) => ({
          id: user._id,
          name: user.first_name + " " + user.last_name,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          roll_no: user.roll_no,
        }));
        setUsers(usersData);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      let apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/get-task-by-assigned`;

      if (role === "principle") {
        apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/get-task-by-principle`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
        console.log(data.tasks);

        setLoading(false);
      } else {
        console.error("Error fetching tasks:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleSubAssignChange = async (taskId: string, userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/add-subassigned-user/${taskId}/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        console.log("Subassign user added successfully");
        toast.success("Subassign user added successfully");
        if (user?.role === "admin") {
          adminfetchTasks();
        }

        fetchTasks();
      } else {
        console.error("Error adding subassign user:", response.statusText);
        toast.error("Error adding subassign user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeadlineChange = async (taskId: string, newDeadline: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/change-deadline/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deadline: newDeadline }),
        },
      );
      if (response.ok) {
        console.log("Deadline updated successfully");
        toast.success("Deadline updated successfully");
        if (user?.role === "admin") {
          adminfetchTasks();
        }

        fetchTasks();
      } else {
        console.error("Error updating deadline:", response.statusText);
        // toast.error("Error updating deadline");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/delete-task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Task deleted successfully");
        toast.success("Task deleted successfully");
        if (user?.role === "admin") {
          adminfetchTasks();
        }

        fetchTasks();
      } else {
        console.error("Error deleting task:", response.statusText);
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleModal = (task?: Task) => {
    setShowModal(!showModal);
    if (task) {
      setTaskDescription(task.description);
      fetchLogs(task);
      setCurrentTask(task);
    }
  };

  useEffect(() => {
    if (selectedUser === "") {
      setAdminTasks(adminTasks);
    } else {
      const filteredTasks = originalAdminTasks.filter(
        (task) => task.assigned._id === selectedUser,
      );
      setAdminTasks(filteredTasks);
    }
  }, [selectedUser, adminTasks]);
  const handleClearFilter = () => {
    setSelectedUser(""); // Clear the selectedUser state
    setAdminTasks(originalAdminTasks); // Reset adminTasks to the original tasks
    setFilterAppilied(false); // Reset the filterApplied state
  };

  useEffect(() => {
    console.log(filterOption);
  }, [filterOption]);

  const formattedSearch = search
    ? tasks.filter((task) => {
        return task.title.toLowerCase().includes(search.toLowerCase());
      })
    : tasks;

  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  if (loading) {
    return <DefaultLayout>Loading...</DefaultLayout>;
  }
  return (
    <div className="overflow-auto">
      <DefaultLayout>
        <Toaster />

        <div className="flex  text-black dark:text-white">
          <div className="overflow-auto">
            <div className=" ">
              <div className="mb-12 font-sansita text-4xl font-bold">
                Welcome, {firstName}
              </div>
              <div className="text-gray-50 font-sansita text-2xl font-semibold">
                Task Management DashBoard
              </div>
            </div>

            <div className="mb-8 mt-10">
              <div className="flex flex-wrap gap-6">
                {/* this is filters */}
                <Options
                  users={users}
                  adminfetchTasks={adminfetchTasks}
                  fetchTasks={fetchTasks}
                  search={search}
                  setSearch={setSearch}
                  setFilterOption={setFilterOption}
                  filterUserUnique={filterUserUnique}
                  setUsernameFilter={SetUsernameFilter}
                  setStatusFilter={setStatusFilter}
                  usernameFilter={usernameFilter}
                  statusFilter={statusFilter}
                  filterTaskSubmit={filterTaskSubmit}
                  filterApplied={filterApplied}
                  setFilterAppilied={setFilterAppilied}
                  setSort={setSort}
                />
              </div>
            </div>
            {user && user.role === "admin" ? (
              <div className="">
                <button
                  className={`rounded-md bg-blue-500 px-4 py-2 text-white ${
                    selectedOption === "assigned to you" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setSelectedOption("assigned to you")}
                >
                  To-Do Tasks
                </button>
                <button
                  className={`mx-2 rounded-md bg-blue-500 px-4 py-2 text-white ${
                    selectedOption === "assigned by you" ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setSelectedOption("assigned by you")}
                >
                  Assigned Tasks
                </button>
              </div>
            ) : null}
            {selectedOption === "assigned to you" ? (
              <div>
                <div>
                  {user && user.role === "principle" ? (
                    <h1 className="mt-7 font-sansita text-2xl font-semibold text-black dark:text-white">
                      Monitor Tasks
                    </h1>
                  ) : null}
                  {/* <h1 className="mt-7 font-sansita text-2xl font-semibold text-black dark:text-white">
                    To-Do Tasks
                  </h1> */}
                </div>
                {/* this is task table */}
                <TaskTable
                  adminfetchTasks={adminfetchTasks}
                  fetchTasks={fetchTasks}
                  tasks={tasks}
                  users={users}
                  handleDeleteTask={handleDeleteTask}
                  handleSubAssignChange={handleSubAssignChange}
                  handleDeadlineChange={handleDeadlineChange}
                  handleStatusChange={handleStatusChange}
                  toggleModal={toggleModal}
                  search={search}
                  filterOption={filterOption}
                  handlePrincipleStatusChange={handlePrincipleStatusChange}
                  edit={false}
                />
              </div>
            ) : null}
          </div>

          {/* this is the chat and file modal */}
          {showModal && (
            <div className="fixed inset-0 z-9999 overflow-y-auto text-black">
              <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                <span className="hidden w-[100px] sm:inline-block sm:h-screen sm:align-middle"></span>
                &#8203;
                <TaskDetailsModal
                  tasks={tasks}
                  currentTask={currentTask}
                  taskDescription={taskDescription}
                  logs={logs}
                  toggleModal={toggleModal}
                  fetchTasks={fetchTasks}
                  setCurrentTask={setCurrentTask}
                />
              </div>
            </div>
          )}

          {/* this is admin task table */}
        </div>
        <div>
          {selectedOption === "assigned by you" ? (
            <div>
              {user && user.role === "admin" ? (
                <div className="mt-10">
                  {/* <div className="mb-2 flex flex-col lg:flex-row lg:items-center"> */}
                  <div className="">
                    {/* <h1 className="mb-5 font-sansita text-2xl font-semibold text-black dark:text-white lg:mb-0">
                      Assigned Tasks
                    </h1> */}
                    <div className="space-x-4 flex items-center justify-end ">
                      <select
                        className="rounded border p-2 dark:bg-boxdark "
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="">User</option>
                        {users
                          .filter((user) => user.role !== "principle")
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.roll_no} {user.first_name} {user.last_name}
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={handleClearFilter}
                        className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-[#B140FF] p-2 px-4 text-white"
                      >
                        Clear Filter
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex overflow-y-auto"> */}
                  <AdminTaskTable
                    adminfetchTasks={adminfetchTasks}
                    fetchTasks={fetchTasks}
                    tasks={adminTasks}
                    users={users}
                    handleDeleteTask={handleDeleteTask}
                    handleSubAssignChange={handleSubAssignChange}
                    handleDeadlineChange={handleDeadlineChange}
                    handleStatusChange={handleStatusChange}
                    toggleModal={toggleModal}
                    search={search}
                    filterOption={filterOption}
                    handlePrincipleStatusChange={handlePrincipleStatusChange}
                    edit={true}
                  />
                  {/* </div> */}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default Page;
