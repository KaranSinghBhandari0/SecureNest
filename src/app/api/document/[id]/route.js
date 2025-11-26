import { deleteDocument, editDocument } from "@/controllers/docController";

export const PUT = async (req, { params }) => {
  return await editDocument(req, params);
}

export async function DELETE(req, { params }) {
  return await deleteDocument(req, params);
}