"use client";

import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { FaTrash } from "react-icons/fa";
import { Edit, Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { EllipsisVertical } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";
import AlertBox from "@/components/common/AlertBox";
import Dropdown from "@/components/common/Dropdown";

export default function DocumentsTable({ documents }) {
  const popupRef = useRef(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showAlertBox, setShowAlertBox] = useState(false);

  const router = useRouter();
  const { request, loading } = useApi();
  useOutsideClick(popupRef, () => setSelectedDoc(null), !!selectedDoc);

  // DELETE DOCUMENT API CALL
  const deleteDocument = async (id) => {
    await request({
      url: `/api/document/${id}`,
      method: "DELETE",
      refresh: true,
      showSuccess: true,
    });
  };

  // EDIT DOCUMENT REDIRECT
  const handleEdit = (id) => {
    router.push(`/documents/${id}/edit`);
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-gray-50 p-4">
      <AlertBox
        visible={showAlertBox}
        title="Delete Document"
        text="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Revert"
        confirmColor="red"
        loading={loading}
        onConfirm={async () => {
          await deleteDocument(deleteId);
          setShowAlertBox(false);
        }}
        onCancel={() => setShowAlertBox(false)}
      />

      <div className="max-w-5xl mx-auto">
        <HeaderSection count={documents?.length} />

        <DocumentsTableView
          documents={documents}
          loading={loading}
          setSelectedDoc={setSelectedDoc}
          handleDelete={(id) => {
            setDeleteId(id);
            setShowAlertBox(true);
          }}
          handleEdit={handleEdit}
        />

        <DocumentPopup
          selectedDoc={selectedDoc}
          closePopup={() => setSelectedDoc(null)}
          popupRef={popupRef}
          handleEdit={handleEdit}
          loading={loading}
        />
      </div>
    </div>
  );
}

// ---------- HEADER ----------
function HeaderSection({ count }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        My Documents
        <span className="ml-2 text-gray-500 text-sm">({count})</span>
      </h1>

      <Link
        href="/documents/create"
        className="px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm"
      >
        Add New Document
      </Link>
    </div>
  );
}

// ---------- TABLE ----------
function DocumentsTableView({
  documents,
  setSelectedDoc,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="overflow-hidden bg-white rounded-xl shadow border border-gray-200">
      <table className="table w-full text-left">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3 hidden md:block">Type</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc._id}
              className="border-b border-gray-200 hover:bg-gray-100 text-sm"
            >
              <td className="p-3">{doc.title}</td>
              <td className="hidden md:block capitalize p-3 text-gray-700">
                {doc.type}
              </td>

              <td className="p-3 text-center">
                <div className="flex justify-center gap-3">
                  <Dropdown
                    icon={<EllipsisVertical size={18} />}
                    options={[
                      {
                        label: "View",
                        icon: <Eye size={16} />,
                        action: () => setSelectedDoc(doc),
                      },
                      {
                        label: "Edit",
                        icon: <Edit size={16} className="text-orange-500" />,
                        action: () => handleEdit(doc._id),
                      },
                      {
                        label: "Delete",
                        icon: <FaTrash size={16} className="text-red-500" />,
                        action: () => handleDelete(doc._id),
                      },
                    ]}
                    onSelect={(item) => item.action && item.action()}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- POPUP MODAL ----------
function DocumentPopup({
  selectedDoc,
  closePopup,
  popupRef,
  handleEdit,
  loading,
}) {
  if (!selectedDoc) return null;

  // RENDER DOCUMENT CONTENT BASED ON TYPE
  const renderDocumentContent = (doc) => {
    switch (doc.type) {
      case "email-password":
      case "username-password":
        return (
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm md:text-base">
            <div className="grid grid-cols-2 gap-2 text-sm md:text-base">
              <strong className="text-gray-600">
                {doc.type === "email-password" ? "Email" : "Username"}:
              </strong>
              <span className="text-gray-800 font-medium break-all">
                {doc.type === "email-password" ? doc.email : doc.username}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <strong className="text-gray-600">Password:</strong>
              <span className="text-gray-800 font-medium break-all">
                {doc.password}
              </span>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="flex justify-center p-2 bg-gray-100 rounded-lg">
            <Image
              src={doc.image}
              className="max-h-80 object-contain rounded-lg shadow-md border border-gray-200"
              alt="Document Content"
              height={256}
              width={256}
            />
          </div>
        );

      case "pdf":
        return (
          <iframe
            src={doc.pdf}
            width="100%"
            height="600px"
            className="border rounded"
            title="PDF Document"
          />
        );

      case "text":
        return (
          <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm whitespace-pre-wrap overflow-auto max-h-80 font-mono">
            {doc.content}
          </pre>
        );

      default:
        return <p className="text-gray-500 italic">Unknown document type</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center p-4 sm:p-8 z-50 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative transition-all duration-300 transform scale-100 border border-gray-200"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 truncate">
            {selectedDoc.title}
          </h2>

          <button
            onClick={closePopup}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <strong className="text-gray-800">Type:</strong>
            <span className="capitalize">{selectedDoc.type}</span>
          </div>

          {renderDocumentContent(selectedDoc)}
        </div>

        <div className="flex justify-end p-4 border-t border-gray-100">
          <button
            onClick={() => handleEdit(selectedDoc._id)}
            className="px-4 py-2 mr-2 flex items-center gap-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
            disabled={loading}
          >
            <Edit size={16} />
            Edit
          </button>

          <button
            onClick={closePopup}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}