"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  value: string[];
  onChange: (features: string[]) => void;
}

export default function FeaturesInput({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (feature: string) => {
    onChange(value.filter((f) => f !== feature));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
        {value.map((feature) => (
          <span
            key={feature}
            className="flex items-center gap-1.5 bg-gold/10 text-gold text-xs px-3 py-1.5 border border-gold/30"
          >
            {feature}
            <button
              type="button"
              onClick={() => remove(feature)}
              className="text-gold/60 hover:text-gold transition-colors leading-none text-base"
              aria-label={`Eliminar ${feature}`}
            >
              ×
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <span className="text-gray-300 text-xs italic">Sin características añadidas</span>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ej: Piscina (Enter para añadir)"
          className="flex-1 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 px-4 py-2.5 text-sm font-light focus:outline-none focus:border-gold transition-colors duration-300"
        />
        <button
          type="button"
          onClick={add}
          className="bg-gold text-white text-xs tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-gold/90 transition-colors flex-shrink-0"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
