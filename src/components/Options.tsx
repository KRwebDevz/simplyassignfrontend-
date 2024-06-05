import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  roll_no: string;
  role: string;
}

interface FilterUser {
  id: string;
  name: string;
  roll_no: string;
}

interface OptionsProps {
  users: User[];
  adminfetchTasks: () => void;
  fetchTasks: () => void;
  search: string;
  setSearch: (search: string) => void;
  setFilterOption: (option: string) => void;
  setUsernameFilter: (username: string) => void;
  setStatusFilter: (status: string) => void;
  usernameFilter: string;
  statusFilter: string;
  filterUserUnique: FilterUser[];
  filterTaskSubmit: () => void;
  filterApplied: boolean;
  setFilterAppilied: (arg0: boolean) => void;
  setSort: (sort: string) => void;
}

const Options: React.FC<OptionsProps> = ({
  users,
  adminfetchTasks,
  fetchTasks,
  search,
  setSearch,
  setFilterOption,
  setUsernameFilter,
  setStatusFilter,
  usernameFilter,
  statusFilter,
  filterUserUnique,
  filterTaskSubmit,
  filterApplied,
  setFilterAppilied,
  setSort,
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] =
    useState<boolean>(false);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [filterRemoving, setFilterRemoving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const role = storedRole ? storedRole : "";
    setUserRole(role);
  }, []);

  const handleFilter = async () => {
    filterTaskSubmit();
    closeFilterModal();
  };

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  const openAssignAdminModal = () => setIsAssignAdminModalOpen(true);
  const closeAssignAdminModal = () => setIsAssignAdminModalOpen(false);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/assign-admin/${selectedAdminUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        toast.success("Admin assigned successfully.");
      } else {
        const data = await response.json();
        toast.error(data.error || "An error occurred while assigning admin.");
      }
      closeAssignAdminModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setDocumentFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("deadline", deadline);
      formData.append("assigned", assignedUserId);
      if (documentFile) formData.append("file", documentFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/create-task`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        toast.success("Task created successfully.");
        closeTaskModal();
        fetchTasks();
        adminfetchTasks();
        setName("");
        setDescription("");
        setDeadline("");
        setAssignedUserId("");
        setDocumentFile(null);
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      {isAssignAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8">
            <h2 className="mb-4 text-lg font-bold">Assign Admin Modal</h2>
            <form onSubmit={handleAssignAdmin}>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Select Admin User
                </label>
                <select
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={selectedAdminUserId}
                  onChange={(e) => setSelectedAdminUserId(e.target.value)}
                  required
                >
                  <option value="">Select User</option>
                  {users
                    .filter((user) => user.role !== "principle")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
                  onClick={closeAssignAdminModal}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-green-500 px-4 py-2 text-white"
                  type="submit"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-modal w-10/12 max-w-xl rounded-lg bg-white p-8 dark:bg-boxdark sm:w-[70%]">
            <h2 className="mb-4 text-base font-bold">CREATE NEW TASK</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter task name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-3 mt-3 block text-sm font-medium text-black dark:text-white">
                  Task Description
                </label>
                <input
                  type="text"
                  placeholder="Enter task description"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white">
                  Deadline *
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={currentDate}
                  required
                />
              </div>

              <div>
                <label className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white">
                  Assigned To *
                </label>
                <select
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  required
                >
                  <option value="">Select User</option>
                  {users
                    .filter((user) => user.role !== "principle")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.roll_no} {user.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white">
                  Document
                </label>
                <input
                  type="file"
                  className="w-full border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex flex-wrap justify-between">
                <button
                  className="mt-8 rounded-lg bg-rose-500 px-4 py-2 text-white"
                  onClick={closeTaskModal}
                >
                  Close
                </button>

                {loading ? (
                  <div className="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white">
                    Creating ...
                  </div>
                ) : (
                  <button
                    className="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white"
                    type="submit"
                  >
                    Create
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* this is the filter modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[400px] rounded-lg bg-white p-8 dark:bg-black">
            <h2 className="mb-4 text-lg font-bold">Filter</h2>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white"></label>

              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                By Status
              </label>
              <select
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Stuck">Stuck</option>
              </select>
              {userRole === "principle" && (
                <div>
                  <label className="mb-3 mt-5 block text-sm font-medium text-black dark:text-white">
                    By Username
                  </label>
                  <select
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => setUsernameFilter(e.target.value)}
                  >
                    <option value="">Select Username</option>
                    {filterUserUnique
                      ? filterUserUnique.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.roll_no} {user.name}
                          </option>
                        ))
                      : ""}
                  </select>
                </div>
              )}

              <h2 className="mb-4 mt-6 text-lg font-bold">Sort</h2>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                By Deadline
              </label>
              <select
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Select Deadline</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <div className="flex items-center justify-between">
                <div className="mt-6 flex items-center space-x-4">
                  <button
                    className="rounded-lg bg-green-500 px-4 py-2 text-white"
                    // onClick={filterTaskSubmit}
                    onClick={handleFilter}
                  >
                    Apply
                  </button>
                  <button
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                    onClick={closeFilterModal}
                  >
                    Close
                  </button>
                </div>

                <button
                  className="ml-2 mt-6 rounded-lg bg-red px-4 py-2 text-white"
                  onClick={() => {
                    setFilterOption("");
                    closeFilterModal();
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(userRole === "principle" || userRole === "admin") && (
        <div
          className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-[#B140FF] p-2 px-4 text-white"
          onClick={openTaskModal}
        >
          New task
        </div>
      )}

      <input
        className="border-gray-300 h-10 w-[190px] rounded-lg border-2 bg-transparent px-5 pr-16 text-sm focus:border-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        type="search"
        name="search"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      {filterApplied ? (
        <div
          className="text-gray-100 border-gray-50 cursor-pointer rounded-lg border bg-red px-3 py-2 text-white"
          onClick={async () => {
            setFilterRemoving(true);
            await fetchTasks();
            await adminfetchTasks();
            setFilterAppilied(false);
            setFilterRemoving(false);
          }}
        >
          {filterRemoving ? "Removing..." : "Remove Filter"}
        </div>
      ) : (
        <div
          className="text-gray-100 border-gray-50 cursor-pointer rounded-lg border px-4 py-2"
          onClick={openFilterModal}
        >
          Filter
        </div>
      )}

      {/* {userRole === "principle" && (
        <div
          className="cursor-pointer rounded-lg bg-green-500 p-2 text-white"
          onClick={openAssignAdminModal}
        >
          Assign Admin
        </div>
      )} */}
    </>
  );
};

export default Options;
