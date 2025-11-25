"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FileInput from "@/components/common/FileInput";
import PasswordInput from "@/components/common/PasswordInput";

export default function CreateDocument() {

  const { request, loading } = useApi();

  const [type, setType] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    username: "",
    password: "",
    image: null,
    text: "",
    pdf: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await request({
      url: "/api/document",
      method: "POST",
      body: { ...formData, type },
      showSuccess: true,
      redirect: "/documents",
      refresh: true,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-gray-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] bg-white rounded-xl border p-6 shadow-sm"
      >
        <h1 className="text-xl text-center font-bold text-gray-900 mb-6">
          Add New Document
        </h1>

        <div className="flex flex-col gap-4">
          {/* Document Title */}
          <Input
            label="Document Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter document title"
            required
          />

          {/* Document Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 mt-1
                         focus:border-blue-500 focus:outline-none text-gray-700"
              required
            >
              <option value="">Select type</option>
              <option value="email-password">Email & Password</option>
              <option value="username-password">Username & Password</option>
              <option value="image">Image</option>
              <option value="text">Text File</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          {/* CONDITIONAL FIELDS */}
          {type === "email-password" && (
            <>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {type === "username-password" && (
            <>
              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {type === "image" && (
            <FileInput
              label="Upload Image"
              name="image"
              accept="image/*"
              required
              onChange={handleChange}
            />
          )}

          {type === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Text Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                rows={4}
                placeholder="Write your text here..."
                className="w-full border border-gray-300 rounded-md p-2 text-gray-700 
                focus:outline-none"
                required
              />
            </div>
          )}

          {type === "pdf" && (
            <FileInput
              label="Upload PDF"
              name="pdf"
              accept="application/pdf"
              required
              onChange={handleChange}
            />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          text="Create Document"
          loading={loading}
          loaderText="Creating..."
          disabled={loading}
          className="mt-4 w-full"
        />
      </form>
    </div>
  );
}
