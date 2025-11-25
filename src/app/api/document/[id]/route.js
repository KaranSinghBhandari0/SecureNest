import { deleteDocument, updateDocument } from "@/controllers/docController";

export const PUT = async (req, { params }) => {
  return await updateDocument(req, { params });
}

export async function DELETE(req, { params }) {
  return await deleteDocument(req, params);
}