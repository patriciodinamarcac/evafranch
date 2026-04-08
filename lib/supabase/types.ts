export type PropertyType = "venta" | "arriendo";
export type PropertyStatus = "active" | "sold" | "rented" | "draft";

export interface Property {
  id: string;
  slug: string;
  type: PropertyType;
  status: PropertyStatus;
  title_es: string;
  title_en: string;
  subtitle_es: string;
  subtitle_en: string;
  description_es: string;
  description_en: string;
  location: string;
  lat: number | null;
  lng: number | null;
  price_uf: number;
  price_clp: number;
  bedrooms: number;
  bathrooms: number;
  total_m2: number;
  parking: number;
  features_es: string[];
  features_en: string[];
  images: string[]; // Supabase Storage public URLs
  video_url: string | null;
  portal_link: string | null;
  extra_specs: { label: string; value: string }[];
  created_at: string;
  updated_at: string;
}
