import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";
import { Property } from "@/lib/supabase/types";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase.from("properties").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-dark">
      <header className="bg-obsidian border-b border-border px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-muted hover:text-gold transition-colors text-sm">
          ← Volver
        </Link>
        <h1
          className="text-ivory text-xl font-medium"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Editar Propiedad
        </h1>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <PropertyForm initial={data as Property} />
      </main>
    </div>
  );
}
