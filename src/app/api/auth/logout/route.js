import { logout } from '@/controllers/authController';

export async function GET() {
  return await logout();
}