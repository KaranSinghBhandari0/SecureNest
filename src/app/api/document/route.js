import { createDocument } from '@/controllers/docController';

export async function POST(req) {
  return await createDocument(req);
}