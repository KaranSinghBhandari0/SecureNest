/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { CloudUpload, X, FileText } from "lucide-react";
import PasswordInput from "@/components/common/PasswordInput";

export default function DocumentForm({ existingDoc, mode }) {
  const isEdit = mode === "edit";
  const { request, loading } = useApi();

  const [type, setType] = useState(existingDoc?.type || "");

  const [doc, setDoc] = useState({
    title: existingDoc?.title || "",
    email: existingDoc?.email || "",
    username: existingDoc?.username || "",
    password: existingDoc?.password || "",
    image: null,
    pdf: null,
    text: existingDoc?.content || "",
  });

  useEffect(() => {
    if (existingDoc?.type) {
      setType(existingDoc.type);
    }
  }, [existingDoc]);

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

    if (isEdit) {
      await request({
        url: `/api/document/${existingDoc._id}`,
        method: "PUT",
        body: fd,
        formData: true,
        showSuccess: true,
        refresh: true,
        redirect: "/documents",
      });
    } else {
      await request({
        url: "/api/document",
        method: "POST",
        body: fd,
        formData: true,
        showSuccess: true,
        refresh: true,
        redirect: "/documents",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[500px] bg-white rounded-xl border p-6 shadow-sm my-4"
    >
      <h1 className="text-xl text-center font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Document" : "Add New Document"}
      </h1>

      <div className="flex flex-col gap-4">
        <Input
          label="Document Title"
          type="text"
          name="title"
          value={doc.title}
          onChange={handleChange}
          placeholder="Enter Document Title"
          required
        />

        {/* Type Selection */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-none"
              required
            >
              <option value="">Select type</option>
              <option value="email-password">Email & Password</option>
              <option value="username-password">Username & Password</option>
              <option value="text">Text File</option>
              <option value="image">Image</option>
              <option value="pdf">Pdf</option>
            </select>
          </div>
        )}

        {/* CONDITIONAL UI */}
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
            <PasswordInput value={doc.password} onChange={handleChange} required />
          </>
        )}

        {type === "username-password" && (
          <>
            <Input
              label="Username"
              name="username"
              value={doc.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
            <PasswordInput value={doc.password} onChange={handleChange} required />
          </>
        )}

        {type === "text" && (
          <textarea
            name="text"
            value={doc.text}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500 focus:border-none text-sm"
          />
        )}

        {type === "image" && (
          <ImageUploadSection doc={doc} setDoc={setDoc} existing={existingDoc} />
        )}

        {type === "pdf" && (
          <PdfUploadSection doc={doc} setDoc={setDoc} existing={existingDoc} />
        )}
      </div>

      <Button
        type="submit"
        text={isEdit ? "Update Document" : "Create Document"}
        loading={loading}
        loaderText={isEdit ? "Updating..." : "Creating..."}
        className="mt-4 w-full"
      />
    </form>
  );
}

/* IMAGE SECTION */
function ImageUploadSection({ doc, setDoc, existing }) {
  return (
    <div>
      {existing?.image && !doc.image && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Image
          </label>
          <div className="relative w-40 h-40 mx-auto">
            <Image
              src={existing.image}
              width={125}
              height={125}
              alt="Existing"
              className="object-contain border rounded"
            />
          </div>
        </>
      )}

      <label className={`block text-sm font-medium text-gray-700 mb-2 ${existing && "mt-4"}`}>
        Upload Image
      </label>

      {!doc.image ? (
        <label
          htmlFor="img-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
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
          />
          <button
            onClick={() => setDoc((prev) => ({ ...prev, image: null }))}
            className="absolute top-1 right-1 bg-white border p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/* PDF SECTION */
function PdfUploadSection({ doc, setDoc, existing }) {
  return (
    <div>
      {existing?.pdf && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous PDF
          </label>
          <iframe
            src={existing.pdf}
            width="100%"
            height="200px"
            className="border rounded"
            title="PDF Document"
          />
        </>
      )}

      <label className={`block text-sm font-medium text-gray-700 mb-2 ${existing && "mt-4"}`}>
        Upload PDF
      </label>

      {!doc.pdf ? (
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
        >
          <FileText className="h-10 w-10 text-gray-400 mb-2" />
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
        <div className="flex items-center gap-2 p-3 border rounded">
          <FileText className="text-red-500" />
          <span>{doc.pdf.name}</span>

          <button
            onClick={() => setDoc((prev) => ({ ...prev, pdf: null }))}
            className="ml-auto bg-white border px-2 py-1 rounded"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
