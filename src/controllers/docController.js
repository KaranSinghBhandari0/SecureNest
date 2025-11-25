import CryptoJS from "crypto-js";
import { connectDB } from "@/lib/connectDB";
import Document from "@/models/docModel";
import { trimObject } from "@/utils/trimObject";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { getCurrentUser } from "./authController";
import Notification from "@/models/notificationSchema";

// CREATE DOCUMENT
export const createDocument = async (req) => {
  try {
    await connectDB();
    const body = trimObject(await req.json());
    const { title, type, username, email, password, text } = body;

    const user = await getCurrentUser();
    const userId = user?._id;

    if (!userId) {
      return errorResponse({ message: "Unauthenticated!" });
    }

    if (!title || !type) {
      return errorResponse({ message: "Title and Type are required" });
    }

    // 🔐 Encrypt sensitive fields
    const encryptedPassword = password
      ? CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString()
      : "";

    const encryptedContent = text
      ? CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString()
      : "";

    const newDoc = await Document.create({
      user: userId,
      title,
      type,
      username: username || "",
      email: email || "",
      password: encryptedPassword,
      content: encryptedContent,
    });

    Notification.create({
      user: user._id,
      title: "New Document Added",
      message: `New document ${title} was added successfully`,
    });

    return successResponse({ message: "Document Created Successfully" });

  } catch (error) {
    console.error("Error creating document:", error);
    return errorResponse({
      message: "Failed to create document",
      error: error.message,
    });
  }
};

// GET ALL DOCUMENTS OF A USER
export const getDocuments = async (req) => {
  try {
    await connectDB();
    const user = await getCurrentUser();
    const userId = user?._id;

    if (!userId) {
      return [];
    }

    const docs = await Document.find({ user: userId }).sort({ createdAt: -1 });

    const jsonDocs = JSON.parse(JSON.stringify(docs));

    // 🔓 Decrypt password & content before sending to frontend
    const decryptedDocs = jsonDocs.map((doc) => {
      try {
        if (doc.password) {
          const bytes = CryptoJS.AES.decrypt(doc.password, process.env.SECRET_KEY);
          doc.password = bytes.toString(CryptoJS.enc.Utf8);
        }

        if (doc.content) {
          const bytes = CryptoJS.AES.decrypt(doc.content, process.env.SECRET_KEY);
          doc.content = bytes.toString(CryptoJS.enc.Utf8);
        }
      } catch (err) {
        console.error("Decryption failed:", err);
        doc.password = "";
        doc.content = "";
      }

      return doc;
    });

    return decryptedDocs;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return errorResponse({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

// UPDATE DOCUMENT
export const updateDocument = async (req) => {
  try {
    await connectDB();
    const body = trimObject(await req.json());
    const { docId, title, username, email, password, text } = body;

    if (!docId) {
      return errorResponse({ message: "Document ID is required" });
    }

    const updated = await Document.findByIdAndUpdate(
      docId,
      {
        username,
        email,
        password,
        content: text,
      },
      { new: true }
    );

    if (!updated) {
      return errorResponse({ message: "Document not found" });
    }

    return successResponse({
      message: "Document updated successfully",
      document: updated,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return errorResponse({ message: "Failed to update document", error: error.message });
  }
};

// DELETE DOCUMENT
export const deleteDocument = async (req, params) => {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return errorResponse({ message: "Document ID is required" });
    }

    const user = await getCurrentUser();
    const userId = user?._id;

    if (!userId) {
      return errorResponse({ message: "Unauthenticated!" });
    }

    const deleted = await Document.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return errorResponse({ message: "Document not found" });
    }

    // Create notification
    Notification.create({
      user: userId,
      title: "Document Deleted",
      message: `Document "${deleted.title || deleted.type}" was deleted successfully.`,
    });

    return successResponse({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return errorResponse({ message: "Failed to delete document", error: error.message });
  }
};
