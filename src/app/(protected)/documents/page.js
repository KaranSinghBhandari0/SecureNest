export const dynamic = "force-dynamic";
import DocumentsTable from "./DocumentsTable";
import { getDocuments } from "@/controllers/docController";

export default async function Page() {
  const documents = await getDocuments();

  return (
    <DocumentsTable documents={documents} />
  );
}
