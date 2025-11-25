/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { FaTrash } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import AlertBox from "@/components/common/AlertBox";

export default function ProfileForm({ user }) {

  const { request, loading } = useApi();

  // 🔴 Show / Hide alert modal
  const [showAlertBox, setShowAlertBox] = useState(false);

  // 🔥 Delete account request
  const deleteAccount = async () => {
    await request({
      url: "/api/auth/deleteAccount",
      method: "DELETE",
      showSuccess: true,
      redirect: "/login",
      refresh: true,
    });

    setShowAlertBox(false); // Close modal after deletion
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 flex items-center justify-center px-4">

      {/* ⭐ AlertBox Popup */}
      <AlertBox
        visible={showAlertBox}
        title="Delete Account"
        text="Are you sure you want to delete your account? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Revert"
        confirmColor="red"
        loading={loading}
        onConfirm={deleteAccount}
        onCancel={() => setShowAlertBox(false)}
      />

      {/* Card */}
      <div className="w-full max-w-md bg-white border rounded-xl shadow-sm overflow-hidden">

        {/* Gradient Header */}
        <div className="w-full h-32 bg-linear-to-r from-purple-500 to-pink-500 relative flex justify-center">

          {/* Profile Image */}
          <div className="absolute -bottom-12 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-purple-500 flex items-center justify-center text-white text-3xl font-medium">
            {user?.image ? (
              <img
                src={user?.image}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.username ? user.username.charAt(0).toUpperCase() : "-"
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-8 px-6 text-center">
          <h2 className="text-xl font-semibold capitalize">
            {user?.username}
          </h2>

          {/* FORM FIELDS */}
          <div className="mt-6 space-y-4 text-left">

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="text"
                defaultValue={user?.email}
                className="w-full border px-3 py-2 rounded-md cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                defaultValue={user?.phoneNumber || "N/A"}
                className="w-full border px-3 py-2 rounded-md cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex items-center justify-between">

            {/* Delete Account */}
            <button
              onClick={() => setShowAlertBox(true)}
              className="text-sm text-red-500 flex items-center gap-2 border px-4 py-2 rounded-md"
            >
              {loading ? "Deleting Account..." : "Delete Account"} <FaTrash />
            </button>

            {/* Saved Documents Button */}
            <Link
              href="/documents"
              className="text-sm border px-3 py-2 rounded-md flex items-center gap-2"
            >
              Saved Documents
              <ChevronRight />
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}