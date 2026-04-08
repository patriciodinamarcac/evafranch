"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) return;

    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-400/60 text-xs hover:text-red-400 transition-colors"
    >
      Eliminar
    </button>
  );
}
