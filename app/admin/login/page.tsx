"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-ivory text-3xl font-medium tracking-wide"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Eva Franch
          </h1>
          <p className="text-muted text-xs tracking-[0.25em] uppercase mt-2">Panel de Control</p>
          <div className="w-8 h-px bg-gold mx-auto mt-4" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-muted text-[0.65rem] tracking-[0.2em] uppercase block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-border text-ivory placeholder:text-muted/40 py-3 text-sm font-light focus:outline-none focus:border-gold transition-colors duration-300"
              placeholder="evafranchcastells@gmail.com"
            />
          </div>

          <div>
            <label className="text-muted text-[0.65rem] tracking-[0.2em] uppercase block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-border text-ivory placeholder:text-muted/40 py-3 text-sm font-light focus:outline-none focus:border-gold transition-colors duration-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-obsidian text-xs tracking-[0.25em] uppercase py-4 font-medium hover:bg-gold/90 transition-colors duration-300 disabled:opacity-60 mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
