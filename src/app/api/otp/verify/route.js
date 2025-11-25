import { verifyOtp } from "@/controllers/otpController"

export const POST = async (req) => {
  return await verifyOtp(req);
}