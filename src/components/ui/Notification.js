"use client";

import { useApi } from "@/hooks/useApi";
import { timeAgo } from "@/utils/helper";
import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";

export default function Notification({ notifications = [] }) {
  const { request, loading } = useApi();
  const count =
    notifications?.filter((n) => n.status === "unread")?.length || 0;

  const handleMark = async (e) => {
    e.preventDefault();
    await request({
      url: "/api/notifications/mark",
      method: "GET",
      refresh: true,
    });
  };

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Icon */}
      <FaBell
        size={22}
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer text-gray-800"
      />

      {/* Badge */}
      {count > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
          {count > 99 ? "99+" : count}
        </span>
      )}

      {/* Notification Dropdown */}
      {open && (
        <div
          className={`
            fixed sm:absolute
            left-1/2 sm:left-auto sm:right-0
            top-16 sm:top-auto
            -translate-x-1/2 sm:translate-x-0
            w-[90%] sm:w-80
            max-h-[70vh] sm:max-h-96
            overflow-y-auto
            rounded-lg shadow-2xl bg-white ring-1 ring-gray-200
            z-50 animate-fadeIn
          `}
        >
          <div className="p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-sm font-semibold text-gray-700">
              Notifications
            </h3>
            <button
              className={`text-xs transition-all ${
                loading
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "text-blue-500 hover:underline cursor-pointer"
              }`}
              disabled={loading || count===0}
              onClick={handleMark}
            >
              {loading ? "Marking..." : "Mark all as read"}
            </button>
          </div>

          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {notifications.map((note, idx) => (
                <li
                  key={idx}
                  className={`px-4 py-3 transition-colors ${
                    note.status === "unread" ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p
                      className={`text-sm ${
                        note.status === "unread"
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {note.message}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(note.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No new notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
}
