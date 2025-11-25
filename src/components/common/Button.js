import { FaSpinner } from 'react-icons/fa';

export default function Button({
  text,
  type="button",
  icon,
  onClick,
  disabled = false,
  loading = false,
  loaderText = "Loading...",
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={!loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
    >
      {loading ? (
        <FaSpinner className="animate-spin text-lg" />
      ) : (
        icon && <span className="text-lg">{icon}</span>
      )}

      <span className="font-medium">
        {loading ? loaderText : text}
      </span>
    </button>
  );
}