"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import Input from "@/components/common/Input";
import PasswordInput from "@/components/common/PasswordInput";
import Button from "@/components/common/Button";
import { CloudUpload, X, FileText } from "lucide-react";
import Image from "next/image";

export default function CreateDocument() {
  const { request, loading } = useApi();

  const [type, setType] = useState("");

  const [doc, setDoc] = useState({
    title: "",
    email: "",
    username: "",
    password: "",
    image: null,
    pdf: null,
    text: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setDoc((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", doc.title);
    fd.append("type", type);

    if (type === "email-password") {
      fd.append("email", doc.email);
      fd.append("password", doc.password);
    }

    if (type === "username-password") {
      fd.append("username", doc.username);
      fd.append("password", doc.password);
    }

    if (type === "image" && doc.image) {
      fd.append("file", doc.image);
    }

    if (type === "pdf" && doc.pdf) {
      fd.append("file", doc.pdf);
    }

    if (type === "text") {
      fd.append("text", doc.text);
    }

    await request({
      url: "/api/document",
      method: "POST",
      body: fd,
      formData: true,
      showSuccess: true,
      refresh: true,
      redirect: "/documents",
    });

    setDoc({
      title: "",
      email: "",
      username: "",
      password: "",
      image: null,
      pdf: null,
      text: "",
    });
    setType("");
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
            value={doc.title}
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
              <option value="pdf">Pdf</option>
            </select>
          </div>

          {/* CONDITIONAL FIELDS */}
          {type === "email-password" && (
            <>
              <Input
                label="Email"
                name="email"
                type="email"
                value={doc.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
              <PasswordInput
                value={doc.password}
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
                value={doc.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
              <PasswordInput
                value={doc.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* IMAGE UPLOAD */}
          {type === "image" && <ImageUploadSection doc={doc} setDoc={setDoc} />}

          {/* TEXT INPUT */}
          {type === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Text Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="text"
                value={doc.text}
                onChange={handleChange}
                rows={4}
                placeholder="Write your text here..."
                className="w-full border border-gray-300 rounded-md p-2 text-gray-700 
                focus:outline-none"
                required
              />
            </div>
          )}

          {/* PDF UPLOAD */}
          {type === "pdf" && <PdfUploadSection doc={doc} setDoc={setDoc} />}
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

/* ---------------- IMAGE UPLOAD (Same UI as Job Creation) ---------------- */
const ImageUploadSection = ({ doc, setDoc }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Image <span className="text-red-500">*</span>
      </label>

      {!doc.image ? (
        <label
          htmlFor="img-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
        >
          <CloudUpload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <input
            id="img-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setDoc((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
        </label>
      ) : (
        <div className="relative w-40 h-40 mx-auto">
          <Image
            src={URL.createObjectURL(doc.image)}
            width={125}
            height={125}
            alt="Preview"
            className="object-contain border rounded"
          />
          <button
            type="button"
            onClick={() => setDoc((prev) => ({ ...prev, image: null }))}
            className="absolute top-1 right-1 bg-white border p-1 rounded-full shadow"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- PDF UPLOAD ---------------- */
const PdfUploadSection = ({ doc, setDoc }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload PDF <span className="text-red-500">*</span>
      </label>

      {!doc.pdf ? (
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
        >
          <FileText className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span>{" "}
            or drag and drop PDF
          </p>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) =>
              setDoc((prev) => ({ ...prev, pdf: e.target.files[0] }))
            }
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 p-3 border rounded">
          <FileText className="text-red-500" />
          <span className="text-sm font-medium">{doc.pdf.name}</span>

          <button
            type="button"
            onClick={() => setDoc((prev) => ({ ...prev, pdf: null }))}
            className="ml-auto bg-white border px-2 py-1 rounded shadow"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
