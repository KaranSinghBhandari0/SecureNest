import { markAllAsRead } from '@/controllers/notificationController';

export async function GET(req) {
  return await markAllAsRead(req);
}