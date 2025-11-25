import { resetPassword } from '@/controllers/authController';

export async function PUT(req) {
  return await resetPassword(req);
}