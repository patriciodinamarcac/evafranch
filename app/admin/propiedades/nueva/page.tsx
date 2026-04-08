import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NuevaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

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
          Nueva Propiedad
        </h1>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <PropertyForm />
      </main>
    </div>
  );
}
