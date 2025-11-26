import { getDocumentById } from "@/controllers/docController";
import DocumentForm from "../../DocumentForm";

export default async function page({ params }) {

  const { id } = await params;
  const document = await getDocumentById(id);

  if(!document){
    return (
      <div className='min-h-[calc(100vh-56px)] p-2'>
        <p className="text-xl text-red-500 font-semibold">
          Document not found!
        </p>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-56px)] flex justify-center items-center bg-blue-50'>
      <DocumentForm existingDoc={document} mode="edit" />
    </div>
  )
}
