import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  signupData: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires in 5 minutes (300 seconds)
  },
});

const OTP = mongoose.models?.OTP || mongoose.model("OTP", otpSchema);
export default OTP;