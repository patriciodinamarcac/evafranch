import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NuevaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 hover:text-gold transition-colors text-sm">
          ← Volver
        </Link>
        <h1
          className="text-gray-900 text-xl font-medium"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Nueva Propiedad
        </h1>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <PropertyForm />
      </main>
    </div>
  );
}
