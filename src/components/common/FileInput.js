/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { FiUploadCloud, FiFile, FiFileText } from "react-icons/fi";

export default function FileInput({
  label,
  name,
  accept,
  required = false,
  onChange,
}) {
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");

    // Preview for images
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setFilePreview(imageUrl);
    } else {
      setFilePreview(null);
    }

    onChange(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <label
        className="
          flex flex-col items-center justify-center w-full
          border-2 border-dashed border-gray-300 rounded-md
          cursor-pointer bg-gray-50 hover:bg-gray-100 transition p-4
        "
      >
        {/* Show preview for image */}
        {filePreview ? (
          <img
            src={filePreview}
            alt="Preview"
            className="h-28 object-contain rounded-md mb-2"
          />
        ) : (
          <>
            <FiUploadCloud size={28} className="text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload file
            </span>
          </>
        )}

        {/* File name display */}
        {fileName && !filePreview && (
          <div className="flex items-center gap-2 mt-2">
            {/* PDF icon */}
            {fileName.endsWith(".pdf") ? (
              <FiFileText size={20} className="text-red-500" />
            ) : (
              <FiFile size={20} className="text-gray-500" />
            )}
            <span className="text-sm text-gray-700 break-all">{fileName}</span>
          </div>
        )}

        <input
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
