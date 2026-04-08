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
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <header className="bg-obsidian border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1
            className="text-ivory text-xl font-medium"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Panel de Control
          </h1>
          <p className="text-muted text-xs mt-0.5">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/propiedades/nueva"
            className="bg-gold text-obsidian text-xs tracking-[0.2em] uppercase px-5 py-2.5 font-medium hover:bg-gold/90 transition-colors duration-300"
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
            <h2 className="text-ivory text-lg font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
              Ventas
            </h2>
            <span className="bg-gold/20 text-gold text-xs px-2 py-0.5">{ventas.length}</span>
          </div>
          <PropertyTable properties={ventas} />
        </section>

        {/* Arriendos */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-ivory text-lg font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
              Arriendos
            </h2>
            <span className="bg-gold/20 text-gold text-xs px-2 py-0.5">{arriendos.length}</span>
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
      <div className="border border-border p-8 text-center">
        <p className="text-muted text-sm">No hay propiedades.</p>
        <Link href="/admin/propiedades/nueva" className="text-gold text-xs mt-2 inline-block hover:underline">
          Agregar la primera →
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="text-left text-muted text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal">Propiedad</th>
            <th className="text-left text-muted text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal hidden md:table-cell">Ubicación</th>
            <th className="text-left text-muted text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal">Precio</th>
            <th className="text-left text-muted text-[0.65rem] tracking-[0.15em] uppercase px-4 py-3 font-normal hidden sm:table-cell">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-card/50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-ivory font-medium">{p.title_es}</p>
                <p className="text-muted text-xs mt-0.5">{p.subtitle_es}</p>
              </td>
              <td className="px-4 py-3 text-muted hidden md:table-cell">{p.location}</td>
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
                    className="text-muted text-xs hover:text-gold transition-colors"
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
    active: { label: "Activa", className: "bg-green-500/10 text-green-400" },
    draft: { label: "Borrador", className: "bg-muted/10 text-muted" },
    sold: { label: "Vendida", className: "bg-red-500/10 text-red-400" },
    rented: { label: "Arrendada", className: "bg-blue-500/10 text-blue-400" },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-[0.65rem] tracking-[0.1em] uppercase px-2 py-1 ${className}`}>
      {label}
    </span>
  );
}
