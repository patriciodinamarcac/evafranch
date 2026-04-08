"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === "es" ? "en" : "es";
    // With localePrefix "as-needed": Spanish = /, English = /en
    if (newLocale === "es") {
      router.push(pathname.replace(`/en`, "") || "/");
    } else {
      router.push(`/en${pathname.startsWith("/es") ? pathname.replace("/es", "") : pathname}`);
    }
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: t("properties"), href: "properties" },
    { label: t("about"), href: "about" },
    { label: t("process"), href: "process" },
    { label: t("contact"), href: "contact" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md border-border"
            : "bg-transparent border-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex flex-col items-start group"
          >
            <span
              className="text-ivory font-heading text-xl font-medium tracking-[0.12em] group-hover:text-gold transition-colors duration-300"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              EVA FRANCH
            </span>
            <span className="text-gold text-[0.6rem] tracking-[0.3em] uppercase font-light">
              Propiedades · Santiago
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-muted hover:text-ivory text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </button>
            ))}

            {/* Language toggle */}
            <button
              onClick={switchLocale}
              className="text-xs tracking-[0.15em] uppercase font-medium border border-border px-3 py-1.5 hover:border-gold hover:text-gold transition-all duration-300 text-muted"
            >
              {locale === "es" ? "EN" : "ES"}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-px bg-ivory"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-px bg-ivory"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-px bg-ivory"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-obsidian/98 flex flex-col items-center justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-ivory text-2xl font-heading hover:text-gold transition-colors duration-300"
                style={{ fontFamily: "var(--font-playfair)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              onClick={switchLocale}
              className="text-muted text-sm tracking-[0.2em] uppercase border border-border px-4 py-2 hover:border-gold hover:text-gold transition-all duration-300 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {locale === "es" ? "English" : "Español"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
