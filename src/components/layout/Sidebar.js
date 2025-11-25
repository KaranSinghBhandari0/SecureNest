"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { Database } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { MdSecurity } from "react-icons/md";
import useOutsideClick from "@/hooks/useOutsideClick";
import { FaSignOutAlt, FaHome, FaUser } from "react-icons/fa";

export default function Sidebar({ showSidebar, setshowSidebar, user }) {

  const { request, loading } = useApi();
  const sidebarRef = useRef(null);

  useOutsideClick(
    sidebarRef,
    () => setshowSidebar(false),
    showSidebar // only active when sidebar is open
  );

  const columns = [
    { name: "Home", icon: FaHome, link: "/" },
    { name: "Profile", icon: FaUser, link: "/profile" },
    { name: "Password Tools", icon: MdSecurity, link: "/password-tools" },
    { name: "My Documents", icon: Database, link: "/documents" },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    await request({
      url: "/api/auth/logout",
      method: "GET",
      showSuccess: true,
      redirect: "/login",
      refresh: true,
    });
    setshowSidebar(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-64 bg-white shadow-lg z-50 
          border-r border-gray-300 transition-transform duration-500 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
    >
      {/* Menu Section */}
      <div className="flex flex-col p-4 gap-2 mt-6">
        {columns.map((column, index) => {
          const Icon = column.icon;
          return (
            <Link
              key={index}
              href={column.link}
              onClick={() => setshowSidebar(false)}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <Icon size={18} className="text-gray-800" />
              <span className="text-md font-medium text-gray-700">
                {column.name}
              </span>
            </Link>
          );
        })}

        {/* Logout button */}
        <button
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer text-left"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={18} className="text-red-500" />
          <span className="text-md font-medium text-red-500">
            {loading ? "Signing Out..." : "Logout"}
          </span>
        </button>
      </div>

      {/* User Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-300 bg-gray-50 flex items-center gap-3">
        {user?.image ? (
          <Image
            src={user.image}
            alt="User"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="font-medium">{user?.username}</span>
      </div>
    </div>
  );
}
