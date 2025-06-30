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
  setStatusFilter: (status: string | string[]) => void;
  usernameFilter: string;
  statusFilter: string | string[];
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
  const [filterRemoving, setFilterRemoving] = useState<boolean>(false);  const [loading, setLoading] = useState<boolean>(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const currentDate = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const role = storedRole ? storedRole : "";
    setUserRole(role);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

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
              <label className="mb-3 block text-sm font-medium text-black dark:text-white"></label>              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                By Status (Select Multiple)
              </label>
              <div className="relative status-dropdown">
                <button
                  type="button"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-left text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <span>
                    {Array.isArray(statusFilter) && statusFilter.length > 0 
                      ? `${statusFilter.length} status(es) selected`
                      : statusFilter && !Array.isArray(statusFilter)
                      ? statusFilter
                      : "Select Status(es)"
                    }
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-5">
                    <svg
                      className={`h-5 w-5 transform transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
                
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-stroke bg-white shadow-lg dark:border-form-strokedark dark:bg-form-input">
                    <div className="space-y-2 p-3">
                      {["Not Started", "In Progress", "Completed", "Stuck"].map((status) => (                        <label key={status} className="flex cursor-pointer items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={Array.isArray(statusFilter) ? statusFilter.includes(status) : statusFilter === status}
                            onChange={(e) => {
                              let newStatusFilter: string | string[] = "";
                              if (e.target.checked) {
                                // Add status to selection
                                if (Array.isArray(statusFilter)) {
                                  newStatusFilter = [...statusFilter, status];
                                } else if (statusFilter) {
                                  newStatusFilter = [statusFilter, status];
                                } else {
                                  newStatusFilter = [status];
                                }
                              } else {
                                // Remove status from selection
                                if (Array.isArray(statusFilter)) {
                                  const filteredArray = statusFilter.filter(s => s !== status);
                                  newStatusFilter = filteredArray.length > 0 ? filteredArray : "";
                                } else if (statusFilter === status) {
                                  newStatusFilter = "";
                                } else {
                                  newStatusFilter = statusFilter;
                                }
                              }
                              
                              // Update the status filter
                              setStatusFilter(newStatusFilter);
                              
                              // Trigger API call immediately for both check and uncheck
                              setTimeout(() => {
                                const hasFilters = (
                                  (Array.isArray(newStatusFilter) && newStatusFilter.length > 0) ||
                                  (typeof newStatusFilter === 'string' && newStatusFilter !== "") ||
                                  usernameFilter ||
                                  filterApplied
                                );
                                
                                if (hasFilters) {
                                  filterTaskSubmit();
                                }
                              }, 100);
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-black dark:text-white">{status}</span>
                        </label>
                      ))}
                    </div>                    <div className="border-t border-stroke p-2 dark:border-form-strokedark">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter("");
                          // Trigger API call after clearing if other filters exist
                          setTimeout(() => {
                            if (usernameFilter || filterApplied) {
                              filterTaskSubmit();
                            }
                          }, 100);
                        }}
                        className="w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              )}              <h2 className="mb-4 mt-6 text-lg font-bold">Sort</h2>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Sort Options
              </label>              <select
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Select Sort Option</option>
                <optgroup label="By Assignee Deadline">
                  <option value="assignee_deadline_asc">Assignee Deadline - Ascending</option>
                  <option value="assignee_deadline_desc">Assignee Deadline - Descending</option>
                </optgroup>
                <optgroup label="By Assignor Deadline">
                  <option value="assignor_deadline_asc">Assignor Deadline - Ascending</option>
                  <option value="assignor_deadline_desc">Assignor Deadline - Descending</option>
                </optgroup>
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
                </div>                <button
                  className="ml-2 mt-6 rounded-lg bg-red px-4 py-2 text-white"
                  onClick={() => {
                    setFilterOption("");
                    setStatusFilter("");
                    setUsernameFilter("");
                    setSort("");
                    setIsStatusDropdownOpen(false);
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
          className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-[#B140FF] py-1 px-3 md:p-2 md:px-4 text-white"
          onClick={openTaskModal}
        >
          <span className="text-[13px]">New Task</span>
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
          className="text-gray-100 border-gray-50 cursor-pointer rounded-lg border py-1 px-3 md:p-2 md:px-4"
          onClick={openFilterModal}
        >
          <span className="text-[13px]">Filter</span>
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
