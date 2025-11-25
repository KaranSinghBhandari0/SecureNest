import React from "react";

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  icon = null,
  className = "",
  inputClassName = "",
  autoFocus = false,
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className={`
            w-full text-sm rounded-md px-3 py-2 text-gray-700 transition
            focus:outline-none border-2 focus:border-blue-500
            ${icon ? "pl-10" : ""}
            border-gray-300
            ${inputClassName}
          `}
          {...props}
        />
      </div>
    </div>
  );
}
