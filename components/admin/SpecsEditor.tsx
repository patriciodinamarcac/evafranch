"use client";

export interface SpecItem {
  label: string;
  value: string;
}

interface Props {
  value: SpecItem[];
  onChange: (specs: SpecItem[]) => void;
}

export default function SpecsEditor({ value, onChange }: Props) {
  const add = () => {
    onChange([...value, { label: "", value: "" }]);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const update = (index: number, field: "label" | "value", val: string) => {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {value.map((spec, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={spec.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Ej: Bodega"
            className="flex-1 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 px-3 py-2 text-sm font-light focus:outline-none focus:border-gold transition-colors"
          />
          <span className="text-gray-300 text-sm flex-shrink-0">:</span>
          <input
            type="text"
            value={spec.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder="Ej: 1"
            className="w-24 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 px-3 py-2 text-sm font-light focus:outline-none focus:border-gold transition-colors text-center"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="w-8 h-9 flex items-center justify-center text-red-300 hover:text-red-500 transition-colors flex-shrink-0 text-lg leading-none"
            aria-label="Eliminar"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-gold text-xs tracking-[0.15em] uppercase hover:text-gold/80 transition-colors border border-dashed border-gold/30 hover:border-gold/60 px-4 py-2 w-full justify-center"
      >
        <span className="text-base leading-none">+</span>
        Añadir campo
      </button>
    </div>
  );
}
