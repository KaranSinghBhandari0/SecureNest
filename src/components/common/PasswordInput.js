"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export default function PasswordInput({
  label = "Password",
  name = "password",
  value,
  onChange,
  placeholder = "Enter password",
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input */}
      <div className="relative mt-1">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-md border-2 border-gray-300 px-3 py-2 pl-9 text-sm focus:border-blue-500 focus:outline-none text-gray-700"
        />

        {/* Left Lock Icon */}
        <FaLock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />

        {/* Eye Toggle Button */}
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
        </button>
      </div>
    </div>
  );
}
