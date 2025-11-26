import CryptoJS from "crypto-js";
import { connectDB } from "@/lib/connectDB";
import Document from "@/models/docModel";
import { trimObject } from "@/utils/trimObject";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { getCurrentUser } from "./authController";
import Notification from "@/models/notificationSchema";
import cloudinary from "@/lib/cloudConfig";

// CREATE DOCUMENT
export const createDocument = async (req) => {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user?._id) {
      return errorResponse({ message: "Unauthenticated!" });
    }

    const form = await req.formData();

    const title = form.get("title")?.toString().trim();
    const type = form.get("type")?.toString().trim();

    if (!title || !type) {
      return errorResponse({ message: "Title and Type are required" });
    }

    const username = form.get("username")?.toString().trim() || "";
    const email = form.get("email")?.toString().trim() || "";
    const password = form.get("password")?.toString().trim() || "";
    const textContent = form.get("text")?.toString() || "";
    const file = form.get("file");

    // ... (Encryption logic remains the same) ...
    const encryptedPassword = password
      ? CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString()
      : "";

    const encryptedContent = textContent
      ? CryptoJS.AES.encrypt(textContent, process.env.SECRET_KEY).toString()
      : "";
    // ...

    let docData = {
      user: user._id,
      title,
      type,
    };

    if (type === "email-password") {
      docData.email = email;
      docData.password = encryptedPassword;
    }

    if (type === "username-password") {
      docData.username = username;
      docData.password = encryptedPassword;
    }

    if (type === "text") {
      docData.content = encryptedContent;
    }

    if (type === "image" || type === "pdf") {
      if (!file) {
        return errorResponse({ message: "File is required" });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const resourceType = type === "image" ? "image" : "raw"; // 'raw' for PDF

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: resourceType,
              folder: "SecureNest",
              use_filename: true,
              unique_filename: false,
              overwrite: true,
              format: type === "image" ? "" : "pdf",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      if (type === "image") {
        docData.image = uploadResult.secure_url;
        docData.cloudinary_id = uploadResult.public_id;
      }
      if (type === "pdf") {
        docData.pdf = uploadResult.secure_url;
        docData.pdf_cloudinary_id = uploadResult.public_id;
      }
    }

    // SAVE DOCUMENT
    const newDoc = await Document.create(docData);

    // ... (Notification and success response) ...
    await Notification.create({
      user: user._id,
      title: "New Document Added",
      message: `New document "${title}" added successfully`,
    });

    return successResponse({
      message: "Document created successfully",
      document: newDoc,
    });
  } catch (error) {
    console.error("Create Document Error:", error);
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
          const bytes = CryptoJS.AES.decrypt(
            doc.password,
            process.env.SECRET_KEY
          );
          doc.password = bytes.toString(CryptoJS.enc.Utf8);
        }

        if (doc.content) {
          const bytes = CryptoJS.AES.decrypt(
            doc.content,
            process.env.SECRET_KEY
          );
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

// GET DOCUMENT BY ID
export const getDocumentById = async (docId) => {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const userId = user?._id;
    if (!userId) {
      return null;
    }

    const doc = await Document.findOne({ _id: docId, user: userId });
    if (!doc) {
      return null;
    }

    // 🔓 Decrypt fields
    try {
      if (doc.password) {
        const bytes = CryptoJS.AES.decrypt(
          doc.password,
          process.env.SECRET_KEY
        );
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

    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};

// EDIT DOCUMENT
export const editDocument = async (req, params) => {
  try {
    await connectDB();

    const { id } = await params;
    if (!id) {
      return errorResponse({ message: "Document ID is required" });
    }

    const user = await getCurrentUser();
    if (!user?._id) {
      return errorResponse({ message: "Unauthenticated!" });
    }

    const doc = await Document.findOne({ _id: id, user: user._id });
    if (!doc) {
      return errorResponse({ message: "Document not found" });
    }

    const form = await req.formData();

    const title = form.get("title")?.toString().trim() || doc.title;
    const type = form.get("type")?.toString().trim() || doc.type;

    let updatedData = { title, type };

    if (type === "email-password") {
      const email = form.get("email")?.toString().trim() || doc.email;
      const password = form.get("password")?.toString().trim();
      // ENCRYPT NEW PASSWORD
      let encryptedPassword = doc.password;
      encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();
      updatedData.email = email;
      updatedData.password = encryptedPassword;
    }

    if (type === "username-password") {
      const username = form.get("username")?.toString().trim() || doc.username;
      const password = form.get("password")?.toString().trim();
      // ENCRYPT NEW PASSWORD
      let encryptedPassword = doc.password;
      encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();
      updatedData.username = username;
      updatedData.password = encryptedPassword;
    }

    if (type === "text") {
      const textContent = form.get("text")?.toString();
      let encryptedContent = doc.content;
      encryptedContent = CryptoJS.AES.encrypt(
        textContent,
        process.env.SECRET_KEY
      ).toString();
      updatedData.content = encryptedContent;
    }

    const file = form.get("file");

    // HANDLE IMAGE OR PDF
    if ((type === "image" || type === "pdf") && file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const resourceType = type === "image" ? "image" : "raw";

      // DELETE OLD MEDIA FROM CLOUDINARY
      if (type === "image" && doc.cloudinary_id) {
        await cloudinary.uploader.destroy(doc.cloudinary_id, {
          resource_type: "image",
        });
      }

      if (type === "pdf" && doc.pdf_cloudinary_id) {
        await cloudinary.uploader.destroy(doc.pdf_cloudinary_id, {
          resource_type: "raw",
        });
      }

      // UPLOAD NEW FILE
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: resourceType,
              folder: "SecureNest",
              use_filename: true,
              unique_filename: false,
              overwrite: true,
              format: type === "image" ? "" : "pdf",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      if (type === "image") {
        updatedData.image = uploadResult.secure_url;
        updatedData.cloudinary_id = uploadResult.public_id;
      }

      if (type === "pdf") {
        updatedData.pdf = uploadResult.secure_url;
        updatedData.pdf_cloudinary_id = uploadResult.public_id;
      }
    }

    const updatedDoc = await Document.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    // NOTIFICATION
    await Notification.create({
      user: user._id,
      title: "Document Updated",
      message: `Your document "${title}" was updated successfully`,
    });

    return successResponse({
      message: "Document updated successfully",
      document: updatedDoc,
    });
  } catch (error) {
    console.error("Edit Document Error:", error);
    return errorResponse({
      message: "Failed to edit document",
      error: error.message,
    });
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

    // Check user
    const user = await getCurrentUser();
    const userId = user?._id;

    if (!userId) {
      return errorResponse({ message: "Unauthenticated!" });
    }

    // Find document
    const doc = await Document.findOne({
      _id: id,
      user: userId,
    });

    if (!doc) {
      return errorResponse({ message: "Document not found" });
    }

    // Delete Cloudinary Document
    if (doc.type === "image" || doc.type === "pdf") {
      const cloudId =
        doc.type === "image" ? doc.cloudinary_id : doc.pdf_cloudinary_id;
      const resource = doc.type === "image" ? "image" : "raw";

      try {
        await cloudinary.uploader.destroy(cloudId, {
          resource_type: resource,
        });
      } catch (err) {
        console.error("Cloudinary delete error:", err);
        return errorResponse({ message: "Server Error" });
      }
    }

    await Document.deleteOne({ _id: id, user: userId });

    Notification.create({
      user: userId,
      title: "Document Deleted",
      message: `Document "${doc.title || doc.type}" was deleted successfully.`,
    });

    return successResponse({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return errorResponse({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};
