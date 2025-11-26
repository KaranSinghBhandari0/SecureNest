import DocumentForm from "../DocumentForm";

export default function CreateDocument() {
  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-gray-50 flex justify-center items-center">
      <DocumentForm mode="create" />
    </div>
  );
}