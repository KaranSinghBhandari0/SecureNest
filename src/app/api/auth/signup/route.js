import { signup } from "@/controllers/authController";

export async function POST(req) {
  return await signup(req);
}