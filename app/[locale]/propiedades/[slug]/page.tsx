import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Property } from "@/lib/supabase/types";
import PropertyDetail from "@/components/PropertyDetail";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("title_es, title_en, subtitle_es, subtitle_en, images")
    .eq("slug", slug)
    .single();

  if (!data) return {};
  const title = locale === "es" ? data.title_es : data.title_en;
  const subtitle = locale === "es" ? data.subtitle_es : data.subtitle_en;

  return {
    title: `${title} | Eva Franch Castells`,
    description: subtitle,
    openGraph: {
      title,
      description: subtitle,
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!data) notFound();

  return <PropertyDetail property={data as Property} locale={locale} />;
}
