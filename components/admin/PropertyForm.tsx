"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Property } from "@/lib/supabase/types";
import FeaturesInput from "./FeaturesInput";

type FormData = Omit<Property, "id" | "created_at" | "updated_at">;

const emptyForm: FormData = {
  slug: "",
  type: "venta",
  status: "active",
  title_es: "",
  title_en: "",
  subtitle_es: "",
  subtitle_en: "",
  description_es: "",
  description_en: "",
  location: "",
  lat: null,
  lng: null,
  price_uf: 0,
  price_clp: 0,
  bedrooms: 0,
  bathrooms: 0,
  total_m2: 0,
  parking: 0,
  features_es: [],
  features_en: [],
  images: [],
  video_url: null,
  portal_link: null,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function PropertyForm({ initial }: { initial?: Property }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          slug: initial.slug,
          type: initial.type,
          status: initial.status,
          title_es: initial.title_es,
          title_en: initial.title_en,
          subtitle_es: initial.subtitle_es,
          subtitle_en: initial.subtitle_en,
          description_es: initial.description_es,
          description_en: initial.description_en,
          location: initial.location,
          lat: initial.lat,
          lng: initial.lng,
          price_uf: initial.price_uf,
          price_clp: initial.price_clp,
          bedrooms: initial.bedrooms,
          bathrooms: initial.bathrooms,
          total_m2: initial.total_m2,
          parking: initial.parking,
          features_es: initial.features_es,
          features_en: initial.features_en,
          images: initial.images,
          video_url: initial.video_url,
          portal_link: initial.portal_link,
        }
      : emptyForm
  );

  const [features, setFeatures] = useState<string[]>(initial?.features_es ?? []);
  const [ufValue, setUfValue] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://mindicador.cl/api/uf")
      .then((r) => r.json())
      .then((data) => setUfValue(data.serie?.[0]?.valor ?? null))
      .catch(() => null);
  }, []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleUfChange = (val: string) => {
    const uf = parseFloat(val) || 0;
    set("price_uf", uf);
    if (ufValue && uf > 0) {
      set("price_clp", Math.round(uf * ufValue));
    }
  };

  const handleClpChange = (val: string) => {
    const clp = parseFloat(val) || 0;
    set("price_clp", clp);
    if (ufValue && clp > 0) {
      set("price_uf", Math.round((clp / ufValue) * 100) / 100);
    }
  };

  const handleTitleEs = (val: string) => {
    set("title_es", val);
    set("title_en", val); // copy to English
    if (!initial) set("slug", slugify(val));
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const supabase = createClient();
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${form.slug || "property"}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("property-images")
        .upload(path, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }

    set("images", [...form.images, ...urls]);
    setUploading(false);
  };

  const removeImage = (url: string) =>
    set("images", form.images.filter((i) => i !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const payload = {
      ...form,
      // Copy Spanish to English automatically
      title_en: form.title_es,
      subtitle_en: form.subtitle_es,
      description_en: form.description_es,
      features_es: features,
      features_en: features,
    };

    let err;
    if (initial) {
      const res = await supabase
        .from("properties")
        .update(payload)
        .eq("id", initial.id);
      err = res.error;
    } else {
      const res = await supabase.from("properties").insert(payload);
      err = res.error;
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 px-4 py-2.5 text-sm font-light focus:outline-none focus:border-gold transition-colors duration-300";
  const labelClass = "text-gray-500 text-[0.65rem] tracking-[0.2em] uppercase block mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Type & Status */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Tipo</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className={inputClass}
          >
            <option value="venta">Venta</option>
            <option value="arriendo">Arriendo</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={inputClass}
          >
            <option value="active">Activa</option>
            <option value="draft">Borrador</option>
            <option value="sold">Vendida</option>
            <option value="rented">Arrendada</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Título</label>
        <input
          type="text"
          required
          value={form.title_es}
          onChange={(e) => handleTitleEs(e.target.value)}
          className={inputClass}
          placeholder="Tríplex Inés de Suárez"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className={labelClass}>Subtítulo</label>
        <input
          type="text"
          value={form.subtitle_es}
          onChange={(e) => { set("subtitle_es", e.target.value); set("subtitle_en", e.target.value); }}
          className={inputClass}
          placeholder="Con Quincho Privado"
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug (URL)</label>
        <input
          type="text"
          required
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          className={inputClass}
          placeholder="triplex-ines-suarez"
        />
        <p className="text-muted text-xs mt-1">
          URL: /propiedades/{form.slug || "..."}
        </p>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Ubicación</label>
        <input
          type="text"
          required
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          className={inputClass}
          placeholder="Providencia, Santiago"
        />
      </div>

      {/* Lat/Lng */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Latitud (opcional)</label>
          <input
            type="number"
            step="any"
            value={form.lat ?? ""}
            onChange={(e) => set("lat", e.target.value ? parseFloat(e.target.value) : null)}
            className={inputClass}
            placeholder="-33.4372"
          />
        </div>
        <div>
          <label className={labelClass}>Longitud (opcional)</label>
          <input
            type="number"
            step="any"
            value={form.lng ?? ""}
            onChange={(e) => set("lng", e.target.value ? parseFloat(e.target.value) : null)}
            className={inputClass}
            placeholder="-70.6331"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        {ufValue && (
          <p className="text-gray-400 text-xs mb-3">
            UF hoy: <span className="text-gold font-medium">${ufValue.toLocaleString("es-CL")}</span>
            {" "}— los valores se convierten automáticamente
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Precio UF</label>
            <input
              type="number"
              required
              min={0}
              step="0.01"
              value={form.price_uf || ""}
              onChange={(e) => handleUfChange(e.target.value)}
              className={inputClass}
              placeholder="7490"
            />
          </div>
          <div>
            <label className={labelClass}>Precio CLP</label>
            <input
              type="number"
              required
              min={0}
              value={form.price_clp || ""}
              onChange={(e) => handleClpChange(e.target.value)}
              className={inputClass}
              placeholder="298414483"
            />
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {(
          [
            { key: "bedrooms", label: "Dormitorios" },
            { key: "bathrooms", label: "Baños" },
            { key: "total_m2", label: "m² totales" },
            { key: "parking", label: "Estacionam." },
          ] as { key: keyof FormData; label: string }[]
        ).map(({ key, label }) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <input
              type="number"
              min={0}
              value={form[key] as number}
              onChange={(e) => set(key, parseFloat(e.target.value))}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          rows={5}
          value={form.description_es}
          onChange={(e) => { set("description_es", e.target.value); set("description_en", e.target.value); }}
          className={`${inputClass} resize-none`}
          placeholder="Descripción completa de la propiedad..."
        />
      </div>

      {/* Features */}
      <div>
        <label className={labelClass}>Características</label>
        <FeaturesInput value={features} onChange={setFeatures} />
      </div>

      {/* Portal link */}
      <div>
        <label className={labelClass}>Link portal externo (opcional)</label>
        <input
          type="url"
          value={form.portal_link ?? ""}
          onChange={(e) => set("portal_link", e.target.value || null)}
          className={inputClass}
          placeholder="https://www.portalinmobiliario.com/..."
        />
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Fotos</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {form.images.map((url, i) => (
            <div key={i} className="relative aspect-square bg-card overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-xs"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-gray-300 hover:border-gold flex flex-col items-center justify-center text-gray-400 hover:text-gold transition-all duration-300 text-xs gap-1"
          >
            {uploading ? (
              <span>Subiendo...</span>
            ) : (
              <>
                <span className="text-2xl font-thin">+</span>
                <span>Subir foto</span>
              </>
            )}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="bg-gold text-white text-xs tracking-[0.2em] uppercase px-8 py-3.5 font-medium hover:bg-gold/90 transition-colors duration-300 disabled:opacity-60"
        >
          {saving ? "Guardando..." : initial ? "Guardar Cambios" : "Crear Propiedad"}
        </button>
        <a
          href="/admin"
          className="text-gray-400 text-xs hover:text-gray-700 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
