import { reSendOtp } from "@/controllers/otpController"

export const POST = async (req) => {
  return await reSendOtp(req);
}