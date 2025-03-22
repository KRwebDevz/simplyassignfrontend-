"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import toast from "react-hot-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const Page = () => {
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState<User[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string>("");
  const [updatedFirstName, setUpdatedFirstName] = useState<string>("");
  const [updatedLastName, setUpdatedLastName] = useState<string>("");
  const [updatedEmail, setUpdatedEmail] = useState<string>("");
  const [updatedRole, setUpdatedRole] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        }));
        setUsers(usersData);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpenModal = (userId: string) => {
    const userToUpdate = users.find((user) => user.id === userId);
    if (userToUpdate) {
      setUpdatingUserId(userId);
      setUpdatedFirstName(userToUpdate.first_name);
      setUpdatedLastName(userToUpdate.last_name);
      setUpdatedEmail(userToUpdate.email);
      setUpdatedRole(userToUpdate.role);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/updateUserByPrinciple/${updatingUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: updatedFirstName,
            last_name: updatedLastName,
            email: updatedEmail,
            role: updatedRole,
          }),
        },
      );

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user.id === updatingUserId
            ? {
                ...user,
                first_name: updatedFirstName,
                last_name: updatedLastName,
                email: updatedEmail,
                role: updatedRole,
              }
            : user,
        );
        setUsers(updatedUsers);
        toast.success("User updated successfully");
        handleCloseModal();
      } else {
        const data = await response.json();
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this user?",
      );
      if (confirmed) {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/deleteUserByPrinciple/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const updatedUsers = users.filter((user) => user.id !== userId);
          setUsers(updatedUsers);
          toast.success("User deleted successfully");
        } else {
          const data = await response.json();
          toast.error(data.msg);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (role !== "principle") {
      toast.error("You are not authorized to view this page");
      window.location.href = "/auth/login";
    } else {
      fetchUsers();
    }
  }, []);

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Email
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-boxdark"
                      : "bg-gray-100 dark:bg-meta-4"
                  }
                >
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.first_name} {user.last_name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {user.email}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p
                      className={`x flex w-30 items-center justify-center rounded-lg px-3 py-1 text-center text-sm font-medium ${user?.role === "admin" ? "bg-green-500 text-white" : user?.role === "principle" ? "bg-orange-500 text-white" : user?.role === "regular" ? "bg-blue-500 text-white" : ""}`}
                    >
                      {user?.role === "regular"
                        ? "User"
                        : user?.role === "principle"
                          ? "Super Admin"
                          : "Admin"}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="mr-20" onClick={() => handleOpenModal(user.id)}>
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg bg-rose-600 p-2 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="bg-gray-500 absolute inset-0 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:ml-4 sm:text-left">
                    <h3 className="text-gray-900 text-lg font-medium leading-6">
                      Update User Details
                    </h3>
                    <div className="mt-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <label
                            htmlFor="firstName"
                            className="text-gray-700 block text-sm font-medium"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={updatedFirstName}
                            onChange={(e) =>
                              setUpdatedFirstName(e.target.value)
                            }
                            className="border-gray-300 mt-1 block w-full rounded-md border border-stroke bg-transparent py-4 pl-6 pr-10 text-black shadow-sm outline-none focus:border-primary focus:ring-primary focus-visible:shadow-none sm:text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <label
                            htmlFor="lastName"
                            className="text-gray-700 block text-sm font-medium"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={updatedLastName}
                            onChange={(e) => setUpdatedLastName(e.target.value)}
                            className="border-gray-300 mt-1 block w-full rounded-md border border-stroke bg-transparent py-4 pl-6 pr-10 text-black shadow-sm outline-none focus:border-primary focus:ring-primary focus-visible:shadow-none sm:text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label
                            htmlFor="email"
                            className="text-gray-700 block text-sm font-medium"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            className="border-gray-300 mt-1 block w-full rounded-md border border-stroke bg-transparent py-4 pl-6 pr-10 text-black shadow-sm outline-none focus:border-primary focus:ring-primary focus-visible:shadow-none sm:text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label
                            htmlFor="role"
                            className="text-gray-700 block text-sm font-medium"
                          >
                            Role
                          </label>
                          <select
                            name="role"
                            id="role"
                            value={updatedRole}
                            onChange={(e) => setUpdatedRole(e.target.value)}
                            className="border-gray-300 mt-1 block w-full rounded-md border border-stroke bg-transparent py-4 pl-6 pr-10 text-black shadow-sm outline-none focus:border-primary focus:ring-primary focus-visible:shadow-none sm:text-sm"
                          >
                            <option value="" disabled>
                              Select Role
                            </option>
                            <option value="admin">Admin</option>
                            <option value="regular">User</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleUpdateUser}
                  type="button"
                  className="hover:bg-primary-dark focus:ring-primary-dark inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-dark mt-3 inline-flex w-full justify-center rounded-md border bg-white px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
    // Making a changes to create pull request
  );
};

export default Page;
