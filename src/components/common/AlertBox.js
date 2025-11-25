import { Loader2 } from "lucide-react";

export default function AlertBox({
  visible,
  title = "Are you sure?",
  text = "Please confirm your action.",
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  confirmColor = "blue",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!visible) {
    return null;
  }

  const confirmClasses = {
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[94%] bg-white shadow-xl rounded-lg max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">{text}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center justify-center gap-2 transition ${
              confirmClasses[confirmColor] || confirmClasses.blue
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
