'use client';
import { useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ForgotPassword from "@/components/ForgotPassword";
import toast from "react-hot-toast";

const Settings = () => {
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');
  const [lastName, setLastName] = useState(localStorage.getItem('lastName') || '');
  const [email] = useState(localStorage.getItem('email') || ''); // Assuming email is immutable

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token'); // Get user token from local storage
      const response = await axios.put(
        "${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/updateUser",
        { first_name: firstName, last_name: lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update successful", response.data);
      toast.success("Name updated successfully");
      // Optionally, you can update local storage with the new names
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="firstName" className="mb-3 block text-sm font-medium text-black dark:text-white">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="lastName" className="mb-3 block text-sm font-medium text-black dark:text-white">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                   
                  </div>

                  <div className="w-full mb-4">
                      <label htmlFor="email" className="mb-3 block text-sm font-medium text-black dark:text-white">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  <div className="flex justify-end gap-4.5">
                    <button type="submit" className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90">
                      Update Name
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <ForgotPassword />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
