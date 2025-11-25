import { login } from '@/controllers/authController';

export async function POST(req) {
  return await login(req);
}