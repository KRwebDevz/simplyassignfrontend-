// TaskDetailsModal.jsx
import React, { useState } from "react";
import Chat from "@/components/Chat";
import FileIcon from "@/components/FileIcon";
import toast from "react-hot-toast";

interface Props {
  tasks: any;
  currentTask: any;
  taskDescription: string;
  logs: any;
  toggleModal: any;
  fetchTasks: any;
  setCurrentTask: any;
  
}

const TaskDetailsModal = ({
  currentTask,
  taskDescription,
  logs,
  toggleModal,
  fetchTasks,
  setCurrentTask,
}: Props) => {
  const [additionFile, setAdditionFile] = useState(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  console.log("currentTask", currentTask);

  const onAdditionFileChange = (e: any) => {
    setAdditionFile(e.target.files[0]);
  };
  const handleFileSubmit = async () => {
    setFileUploadLoading(true);
    const formData = new FormData();
    if (additionFile) {
      formData.append("file", additionFile);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/add-additional-files/${currentTask._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        fetchTasks();
        setCurrentTask(responseData.task);
        toast.success("file submitted successfully");
        setAdditionFile(null); // Move this line inside the if (response.ok) block
      } else {
        toast.error("error submitting file");
      }
    } catch (error) {
      console.error(error);
      toast.error("error submitting file");
    } finally {
      setFileUploadLoading(false);
    }
  };

  return (
    <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
      <div className="flex min-h-[400px] flex-col bg-white px-4 pb-4 pt-5 sm:flex-row sm:p-6 sm:pb-4">
        <div className="sm:order-2 sm:w-full">
          <div className="mb-4 flex gap-x-10">
            <button
              className={`rounded-lg px-4 cursor-pointer py-2 ${activeTab === "chat" ? " bg-gradient-to-r from-violet-600 to-[#B140FF] text-white" : "bg-gray-200 text-gray-700"}`}

              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
            <button
              className={`mr-4 rounded-md px-4 py-2 ${activeTab === "documents" ? "bg-gradient-to-r from-violet-600 to-[#B140FF] text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
            <button
              className={`mr-4 rounded-md px-4 py-2 ${activeTab === "logs" ? "bg-gradient-to-r from-violet-600 to-[#B140FF] text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setActiveTab("logs")}
            >
              Logs
            </button>
          </div>

          {activeTab === "documents" && (
            <>
              <div className="mb-8  ">
                <p className="text-[15px]">
                  Task Name:{" "}
                  <span className="">
                    {currentTask?.title}
                  </span>
                </p>
                <h3 className="text-[15px] ">
                  Description of task:{" "}
                  <span className=" ">
                    {taskDescription}
                  </span>
                </h3>
              </div>
              <hr className="mb-4 w-11/12 px-2" />
              <div className="border-gray-200 h-full  pl-4 pr-4 sm:pr-0">
                <div className="flex flex-wrap justify-start items-center gap-8">
                  {currentTask?.fileLocations.map(
                    (location: any, index: any) => (
                      <a
                        key={index}
                        href={location}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileIcon />
                      </a>
                    ),
                  )}
                </div>

                <div className="mt-12">
                  <div className="flex">
                    <input
                      className="bg-gray-200  text-gray-800 hover:bg-gray-300 cursor-pointer rounded-lg border-2 border-green-500 p-2 text-base hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      type="file"
                      name="additionfile"
                      id="additionfile"
                      onChange={onAdditionFileChange}
                    />
                    {additionFile ? (
                      <div className="bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          onClick={handleFileSubmit}
                          type="button"
                          className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-[#B140FF] p-2 px-4 text-white"
                        >
                          {fileUploadLoading ? "Uploading..." : "Submit"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "logs" && (
            <div className="mt-4">
              <p className="mt-4 text-lg font-semibold">LOGS</p>
              <ul>
                {logs.map((logItem: any) => (
                  <li key={logItem._id}>
                    <p>{logItem.log}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "chat" && currentTask && <> <div className="mb-8">
                <h1 className="text-[15px]">
                  Task Name:{" "}
                  <span className="">
                    {currentTask?.title}
                  </span>
                </h1>
                <h3 className="font-[15px]">
                  Description of task:{" "}
                  <span className="">
                    {taskDescription}
                  </span>
                </h3>
              </div><Chat task={currentTask} /></>}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-2 sm:flex sm:flex-row-reverse">
        <button
          onClick={toggleModal}
          type="button"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border bg-white px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
