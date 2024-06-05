import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
}
interface MessageData {
  message: string;
  sender: ApiUser;
}

export interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
}
interface Assigned {
  email: string;
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
}

const Chat: React.FC<{ task: Task }> = ({ task }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User>();

  const getLoggedinUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setUser(data);
              console.log(data);
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoggedinUser();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/messages/${task._id}`,
    );
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, [task]);

  useEffect(() => {
    const newSocket: Socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);
    setSocket(newSocket);
    console.log("taskid", task._id);
    newSocket.emit("joinTask", task._id);

    newSocket.on("newMessage", (data: MessageData) => {
      fetchMessages();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [task]);

  const sendMessage = () => {
    if (socket && user) {
      socket.emit("newMessage", {
        taskId: task._id,
        message: messageInput,
        sender: user.id,
      });
      setMessageInput("");
    }

    fetchMessages();
  };

  return (
    <div className="mb-15 ml-2 p-2 sm:order-2 sm:w-full">
      <div className="bg-gray-100 mt-2 flex items-center justify-between rounded-lg border p-1 text-black">
        <input
          type="text"
          placeholder="Enter your text here"
          className="border-gray-300 flex-1 rounded-md px-3 py-2 focus:border-indigo-500 focus:outline-none"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          className="ml-2 rounded-md bg-indigo-500 px-4 py-2 text-white"
          onClick={sendMessage}
          disabled={!socket}
        >
          Send
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex justify-${msg?.sender._id === user?.id ? "end" : "start"}`}
          >
            <span
              className={`mt-4  rounded-lg border p-4 text-${
                msg?.sender?._id === user?.id ? "right" : "left"
              }`}
            >
              {typeof msg.sender === "string" ? (
                  <div className="text-lg">Sender: {msg.sender}</div>
                ) : (
                  <div className="text-lg">
                    Sender: {msg.sender.first_name} {msg.sender.last_name}
                  </div>
                )}
              <div>
                <span className="text-gray-500 mt-2 text-xl font-bold">
                  {msg?.message}
                </span>
                
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
