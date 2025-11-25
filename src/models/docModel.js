const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["email-password", "username-password", "image", "text", "pdf"]
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  // cloudinary id for image
  cloudinary_id: {
    type: String,
  },
  pdf: {
    type: String,
  },
  // cloudinary id for pdf
  pdf_cloudinary_id: {
    type: String,
  },
  content: {
    type: String,
  }
}, { timestamps: true });

const Document = mongoose.models?.Document || mongoose.model("Document", docSchema);
export default Document;
