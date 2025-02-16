import React, { useState } from "react";
import FileIcon from "@/components/FileIcon";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { MdDelete } from "react-icons/md";
import axios from "axios";

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
  assignedBy : assignedBy;
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

interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  roll_no: string;
}

interface TaskTableProps {
  tasks: Task[];
  users: User[];
  handleDeleteTask: (taskId: string) => void;
  handleSubAssignChange: (taskId: string, userId: string) => void;
  handleDeadlineChange: (taskId: string, newDeadline: string) => void;
  handleStatusChange: (taskId: string, newStatus: string) => void;
  toggleModal: (task?: Task) => void;
  search: string;
  adminfetchTasks: () => void;
  fetchTasks: () => void;
  filterOption: string;
  edit: boolean;
  handlePrincipleStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  users,
  adminfetchTasks,
  fetchTasks,
  handleDeleteTask,
  handleSubAssignChange,
  handleDeadlineChange,
  handleStatusChange,
  toggleModal,
  search,
  edit,
  filterOption,
  handlePrincipleStatusChange,
}) => {
  const { user } = useAuth();
  const currentDate = new Date().toISOString().split("T")[0];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editAssignee, setEditAssignee] = useState("");

  const formatDeadline = (deadline: string | null): string => {
    if (!deadline) return "";
    const date = new Date(deadline);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formattedSearch = search
    ? tasks.filter((task) => {
        return task.title.toLowerCase().includes(search.toLowerCase());
      })
    : tasks;

  function truncateString(str: string, num: number): string {
    // If the length of the string is less than or equal to the number, return the string.
    if (str.length <= num) {
      return str;
    }
    // Otherwise, return the first num characters of the string, plus an ellipsis.
    return str.slice(0, num) + "....";
  }

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDeadline(task.deadline);
    setEditAssignee(task.assigned?._id || ""); // Assuming task.assigned._id is the assignee ID
    setIsEditModalOpen(true);
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditAssignee(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditDescription(e.target.value);
  };

  const handleEditDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDeadline(e.target.value);
  };

  const handleSaveEdit = async () => {
    if (editTask) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/edit-task/${editTask._id}`,
          {
            title: editTitle,
            description: editDescription,
            deadline: editDeadline,
            assigned: editAssignee,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.status === 200) {
          setIsEditModalOpen(false);
          toast.success("Task Edited");

          adminfetchTasks();
          fetchTasks();
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  return (
    <div className="text-[15px]">
      <div>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[80%] max-w-xl rounded-lg bg-white p-8 dark:bg-boxdark">
              <h2 className="mb-4 text-lg font-bold">Edit Task</h2>
              <div className="mb-4">
                <label
                  htmlFor="editTitle"
                  className="text-gray-700 mb-1 block text-sm font-medium dark:text-white"
                >
                  Task Title
                </label>
                <input
                  id="editTitle"
                  type="text"
                  placeholder="Enter title"
                  value={editTitle}
                  onChange={handleTitleChange}
                  className="border-gray-300 w-full rounded-md border p-2 dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editDescription"
                  className="text-gray-700 mb-1 block text-sm font-medium dark:text-white"
                >
                  Task Description
                </label>
                <textarea
                  id="editDescription"
                  placeholder="Enter description"
                  value={editDescription}
                  onChange={handleDescriptionChange}
                  className="border-gray-300 w-full rounded-md border p-2 dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editDeadline"
                  className="text-gray-700 mb-1 block text-sm font-medium dark:text-white"
                >
                  Task Deadline
                </label>
                <input
                  id="editDeadline"
                  type="date"
                  value={editDeadline}
                  onChange={handleEditDeadlineChange}
                  className="border-gray-300 w-full rounded-md border p-2 dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editAssignee"
                  className="text-gray-700 mb-1 block text-sm font-medium dark:text-white"
                >
                  Task Assignee
                </label>
                <select
                  id="editAssignee"
                  value={editAssignee}
                  onChange={handleAssigneeChange}
                  className="border-gray-300 w-full rounded-md border p-2 dark:bg-boxdark dark:text-white"
                >
                  <option value="">Select Assignee</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-800 bg-gray-300 hover:bg-gray-400 mr-2 rounded px-4 py-2 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-12 h-[280px] w-full overflow-auto rounded-2xl border-t  md:mt-5 ">
        <table className="w-full table-auto rounded-2xl border-b border-l border-r bg-white  text-black dark:bg-[#30324e] dark:text-[#d5d8df]">
          <thead className="rounded-xl text-[15px] ">
            <tr className="rounded-md  border-b bg-white dark:bg-[#30324e]">
              <th className="sticky left-0 top-0 z-10 border-r bg-white  px-4  py-1  dark:bg-[#30324e]">
                Task
              </th>
              <th className="sticky top-0  border-r bg-white px-4  py-1 dark:bg-[#30324e]">
                Assignor
              </th>
              <th className="sticky top-0  border-r bg-white px-4  py-1 dark:bg-[#30324e]">
                Assignee
              </th>
              <th className="sticky top-0 border-r bg-white px-4  py-1 dark:bg-[#30324e]">
                Sub Assignee
              </th>
              <th className="] sticky top-0 border-r bg-white  px-4 py-1 dark:bg-[#30324e]">
                Assignor Deadline
              </th>
              <th className="sticky top-0 border-r bg-white px-4  py-1  dark:bg-[#30324e]">
                Assignee Deadline
              </th>
              <th className="sticky top-0 border-r  bg-white px-4 py-1  dark:bg-[#30324e]">
                Assignor Status
              </th>
              <th className="sticky top-0 border-r bg-white px-4 py-1  dark:bg-[#30324e]">
                Assignee Status
              </th>

              <th className="sticky top-0 border-r bg-white  px-4 py-1 dark:bg-[#30324e]">
                More Details
              </th>
              {user?.role === "principle" && (
                <th className="sticky top-0 border-r bg-white px-4 py-1 dark:bg-[#30324e]">
                  Edit
                </th>
              )}
              {edit === true && (
                <th className="sticky top-0 border-r bg-white px-4 py-1 dark:bg-[#30324e]">
                  Edit
                </th>
              )}
              {edit === true && (
                <th className="sticky top-0 border-r bg-white px-4 py-1 dark:bg-[#30324e]">
                  Delete
                </th>
              )}
              {user?.role === "principle" && (
                <th className="sticky top-0 border-r bg-white px-4 py-1 dark:bg-[#30324e]">
                  Delete
                </th>
              )}
            </tr>
          </thead>
          <tbody className="w-[1400px] text-[15px]">
            {formattedSearch && formattedSearch.length > 0 ? (
              formattedSearch.map((task, index) => (
                <tr key={index} className="border-y">
                  <td className="sticky left-0 min-w-[360px] bg-white px-3 dark:bg-[#30324e] md:w-[160px] underline underline-offset-2">
                    <div
                      onClick={() => toggleModal(task)}
                      className="cursor-pointer"
                    >
                      {truncateString(task.title, 40)}
                    </div>
                  </td>
                  <td className="min-w-[150px] border px-3 md:w-[160px]">
                    <span className="">
                      {task?.assigned
                        ? ` ${task.assignedBy.first_name}  ${task?.assignedBy?.roll_no}  `
                        : "Not Assigned"}
                    </span>
                  </td>
                  <td className="min-w-[130px] border px-3 md:w-[120px]">
                    <span className="">
                      {task?.assigned
                        ? ` ${task.assigned.first_name}  ${task?.assigned?.roll_no}  `
                        : "Not Assigned"}
                    </span>
                  </td>
                  <td className="min-w-[130px] border px-2 md:w-[120px]">
                    <select
                      value={task.subassigned?._id || ""}
                      onChange={(e) =>
                        handleSubAssignChange(task._id, e.target.value)
                      }
                      className="w-[130px] rounded bg-transparent p-1"
                    >
                      {/* <option value="" className=" bg-boxdark text-white">
                        {task.subassigned
                          ? `${task.subassigned.first_name} ${task.subassigned.last_name}`
                          : "None"}
                      </option> */}
                      <option className="bg-boxdark text-white" value="none">
                        None
                      </option>
                      {users
                        .filter(
                          (user) =>
                            user?.role !== "principle" &&
                            user?.id !== task.assigned?._id,
                        )
                        .map((user) => (
                          <option
                            key={user.id}
                            className="bg-boxdark text-white"
                            value={user.id}
                          >
                            {user.first_name} {user.roll_no}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="min-w-[150px] border px-4 text-center md:w-[150px]">
                    <p>{formatDeadline(task.deadline)}</p>
                  </td>

                  <td className="min-w-[150px] border px-4 text-center md:w-[150px]">
                    {user && user.role !== "principle" ? (
                      task.updatedDeadline ? (
                        <p>{formatDeadline(task.updatedDeadline)}</p>
                      ) : (
                        <input
                          type="date"
                          placeholder="Add new Deadline"
                          className=" text-black"
                          value={formatDeadline(task.deadline)}
                          min={currentDate}
                          onChange={(e) =>
                            handleDeadlineChange(task._id, e.target.value)
                          }
                        />
                      )
                    ) : (
                      <p className="">
                        {task.updatedDeadline
                          ? formatDeadline(task.updatedDeadline)
                          : "--"}
                      </p>
                    )}
                  </td>
                  <td className=" w-[150px] border dark:text-white">
                    {user && user.role === "principle" ? (
                      <select
                        className={` input w-[150px] px-4 py-[8px] dark:text-white  ${
                          task.PricipleStatus === "Not Started"
                            ? "bg-[#c4c4c4]"
                            : task.PricipleStatus === "In Progress"
                              ? "bg-[#fdab3d]"
                              : task.PricipleStatus === "Completed"
                                ? "bg-[#00c875]"
                                : task.PricipleStatus === "Stuck"
                                  ? "bg-[#df2f4a]"
                                  : ""
                        }  status-${task.PricipleStatus}`}
                        value={task.PricipleStatus}
                        onChange={(e) =>
                          handlePrincipleStatusChange(task._id, e.target.value)
                        }
                      >
                        <option
                          value="Not Started"
                          className="status-ns bg-[#c4c4c4]"
                        >
                          Not Started
                        </option>
                        <option
                          value="In Progress"
                          className="status-InProgress bg-[#fdab3d]"
                        >
                          In Progress
                        </option>
                        <option value="Completed" className="bg-[#00c875]">
                          Completed
                        </option>
                        <option value="Stuck" className="bg-[#df2f4a]">
                          Perpetual
                        </option>
                      </select> //done colouring
                    ) : (
                      <div
                        className={`w-[150px] py-[8px] text-center ${
                          task.PricipleStatus === "Not Started"
                            ? "bg-[#c4c4c4] "
                            : task.PricipleStatus === "In Progress"
                              ? "bg-[#fdab3d]"
                              : task.PricipleStatus === "Completed"
                                ? "bg-[#00c875]"
                                : task.PricipleStatus === "Stuck"
                                  ? "bg-[#df2f4a]"
                                  : ""
                        }`}
                      >
                        {task.PricipleStatus}
                      </div> //done colouring
                    )}
                  </td>
                  <td className="w-[150px] border text-black dark:text-white ">
                    {user && user.role !== "principle" ? (
                      <select
                        className={`input w-[148px] px-4 py-[8px] ${
                          task.status === "Not Started"
                            ? "bg-[#c4c4c4]"
                            : task.status === "In Progress"
                              ? "bg-[#fdab3d]"
                              : task.status === "Completed"
                                ? "bg-[#00c875]"
                                : task.status === "Stuck"
                                  ? "bg-[#df2f4a]"
                                  : ""
                        }`}
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                      >
                        <option value="Not Started" className="status-ns bg-[#c4c4c4]">
                          Not Started
                        </option>
                        <option value="In Progress" className="status-InProgress bg-[#fdab3d]">
                          In Progress
                        </option>
                        <option value="Completed" className="bg-[#00c875]">
                          Completed
                        </option>
                        <option value="Stuck" className="bg-[#df2f4a]">
                          Perpetual
                        </option>
                      </select>
                    ) : (
                      <div
                        className={`w-[150px] py-[8px] text-center ${
                          task.status === "Not Started"
                            ? "bg-[#c4c4c4] "
                            : task.status === "In Progress"
                              ? "bg-[#fdab3d]"
                              : task.status === "Completed"
                                ? "bg-[#00c875]"
                                : task.status === "Stuck"
                                  ? "bg-[#df2f4a]"
                                  : ""
                        }`}
                      >
                        {task.status === "Stuck" ? "Perpetual" : task.status}
                      </div>
                    )}
                  </td>

                  <td className="w-[100px] border">
                    <button
                      onClick={() => toggleModal(task)}
                      className="h-full w-[150px] font-bold text-black dark:text-white"
                    >
                      Open
                    </button>
                  </td>
                  {edit === true && (
                    <td className="w-[100px] border px-2 text-center">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="h-10 w-16 font-bold text-black dark:text-white"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {user?.role === "principle" && (
                    <td className="w-[100px] border px-2 text-center">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="h-10 w-16 font-bold text-black dark:text-white"
                      >
                        Edit
                      </button>
                    </td>
                  )}

                  {edit === true && (
                    <td className="flex w-[70px] items-center justify-center">
                      <button
                        className="delete-btn  h-10 w-5 items-center justify-center font-bold text-red"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <MdDelete size={25} />
                      </button>
                    </td>
                  )}
                  {user?.role === "principle" && (
                    <td className="flex w-[70px] items-center justify-center">
                      <button
                        className="delete-btn  h-10 w-5 items-center justify-center font-bold text-red"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <MdDelete size={25} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
