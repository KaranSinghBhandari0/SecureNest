import { deleteAccount } from '@/controllers/authController';

export async function DELETE(req) {
  return await deleteAccount(req);
}