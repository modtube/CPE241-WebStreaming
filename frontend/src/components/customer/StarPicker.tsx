import { useState } from 'react';

export default function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500 text-xs mr-1.5">Rating:</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i + 1)}
          className="bg-transparent border-none cursor-pointer text-xl p-0 transition-all duration-150"
          style={{
            color: i < (hover || value) ? "#efc8d5" : "#333",
            transform: i < (hover || value) ? "scale(1.15)" : "scale(1)",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}