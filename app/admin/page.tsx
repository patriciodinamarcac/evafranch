import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Property } from "@/lib/supabase/types";
import AdminLogoutButton from "@/components/admin/LogoutButton";
import AdminDeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const ventas = (properties as Property[] | null)?.filter((p) => p.type === "venta") ?? [];
  const arriendos = (properties as Property[] | null)?.filter((p) => p.type === "arriendo") ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1
            className="text-gray-900 text-xl font-medium"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Panel de Control
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/propiedades/nueva"
            className="bg-gold text-white text-xs tracking-[0.2em] uppercase px-5 py-2.5 font-medium hover:bg-gold/90 transition-colors duration-300"
          >
            + Nueva Propiedad
          </Link>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Ventas */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-gray-900 text-lg font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
              Ventas
            </h2>
            <span className="bg-gold/10 text-gold text-xs px-2 py-0.5 font-medium">{ventas.length}</span>
          </div>
          <PropertyTable properties={ventas} />
        </section>

        {/* Arriendos */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-gray-900 text-lg font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
              Arriendos
            </h2>
            <span className="bg-gold/10 text-gold text-xs px-2 py-0.5 font-medium">{arriendos.length}</span>
          </div>
          <PropertyTable properties={arriendos} />
        </section>
      </main>
    </div>
  );
}

function PropertyTable({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-400 text-sm">No hay propiedades.</p>
        <Link href="/admin/propiedades/nueva" className="text-gold text-xs mt-2 inline-block hover:underline">
          Agregar la primera →
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 bg-white overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left text-gray-400 text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal">Propiedad</th>
            <th className="text-left text-gray-400 text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal hidden md:table-cell">Ubicación</th>
            <th className="text-left text-gray-400 text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal">Precio</th>
            <th className="text-left text-gray-400 text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal hidden sm:table-cell">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-gray-900 font-medium">{p.title_es}</p>
                <p className="text-gray-400 text-xs mt-0.5">{p.subtitle_es}</p>
              </td>
              <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.location}</td>
              <td className="px-4 py-3 text-gold font-medium">
                UF {p.price_uf.toLocaleString("es-CL")}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 justify-end">
                  <Link
                    href={`/admin/propiedades/${p.id}`}
                    className="text-gray-400 text-xs hover:text-gold transition-colors"
                  >
                    Editar
                  </Link>
                  <AdminDeleteButton id={p.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: Property["status"] }) {
  const map = {
    active: { label: "Activa", className: "bg-green-50 text-green-600 border border-green-200" },
    draft: { label: "Borrador", className: "bg-gray-100 text-gray-500 border border-gray-200" },
    sold: { label: "Vendida", className: "bg-red-50 text-red-500 border border-red-200" },
    rented: { label: "Arrendada", className: "bg-blue-50 text-blue-500 border border-blue-200" },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-[0.65rem] tracking-[0.1em] uppercase px-2 py-1 ${className}`}>
      {label}
    </span>
  );
}
