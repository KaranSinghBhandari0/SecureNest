"use client";

import Link from "next/link";
import Image from "next/image";
import Sidebar from "../Sidebar";
import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import Notification from "@/components/ui/Notification";

export default function Header({ user, notifications }) {

  const [showSidebar, setshowSidebar] = useState(false);

  return (
    <header>
      <Sidebar
        showSidebar={showSidebar}
        setshowSidebar={setshowSidebar}
        user={user}
      />

      <div className="w-full h-14 flex justify-between items-center px-3 border-b border-gray-300 fixed top-0 z-30 bg-white">
        <Link href="/" className="flex items-center gap-2">
          <FaShieldAlt size={18} className="text-blue-500" />
          <p className="font-semibold text-lg">SecureNest</p>
        </Link>

        <div className="flex gap-6 items-center">
          {user && (
            <Notification notifications={notifications} />
          )}

          {user ? (
            <button onClick={() => setshowSidebar(true)}>
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div className="h-8 w-8 flex justify-center items-center rounded-full text-white font-medium bg-purple-500 cursor-pointer">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 text-white rounded px-2 py-1 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
