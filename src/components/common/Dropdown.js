import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function Dropdown({
  label,
  icon = <ChevronDown className="w-4 h-4" />,
  options = [],
  onSelect = () => {},
  width = "w-35 md:w-40",
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setOpen(false), open);

  const handleOpen = () => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });

    setOpen((p) => !p);
  };

  return (
    <>
      {/* Trigger */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition-all border-none outline-none"
      >
        <span className="text-sm">{label}</span>
        {icon}
      </button>

      {/* Dropdown via Portal */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              top: pos.top,
              left: pos.left,
            }}
            className={`absolute ${width} bg-white border border-gray-200 rounded-lg shadow-xl 
                  py-2 z-9999 transform translate-x-[-30%] md:translate-x-[20%]`}
          >
            {options.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
