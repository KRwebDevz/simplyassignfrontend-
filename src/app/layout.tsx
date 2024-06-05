"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { use, useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AuthContextProvider from "@/context/AuthContext";
import "../global.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "300",
  // display: 'swap',
  style: "normal",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse the response JSON
          } else {
            throw new Error("Unauthorized");
          }
        })
        .then((data) => {
          // Store the role from the response in localStorage
          localStorage.setItem("role", data.role);
          console.log("valid");
        })
        .catch((error) => {
          console.error("Error:", error);
          router.push("/auth/signin");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      router.push("/auth/signin");
      setLoading(false);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>SimplyAssign | Work Management</title>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="./favicon.ico"
        />{" "}
        <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico" />
      </head>
      <body suppressHydrationWarning={true} className="font-poppins">
        <AuthContextProvider>
          <Toaster />
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
