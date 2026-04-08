"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/supabase/types";

function PropertyCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const validImages = images.filter((_, i) => !imgError[i]);
  const displayIndex = validImages.length > 0 ? current % validImages.length : 0;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrent((c) => (c - 1 + validImages.length) % validImages.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrent((c) => (c + 1) % validImages.length);
  };

  if (validImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card-hover to-dark flex flex-col items-center justify-center gap-3">
        <svg className="w-10 h-10 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-gold/40 text-[0.6rem] tracking-[0.2em] uppercase">Fotografías próximamente</span>
      </div>
    );
  }

  return (
    <>
      {/* Hidden preload images to detect errors */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="hidden"
          onError={() => setImgError((prev) => ({ ...prev, [i]: true }))}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={displayIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={validImages[displayIndex]}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={displayIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {validImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-obsidian/60 backdrop-blur-sm flex items-center justify-center hover:bg-gold/80 hover:text-obsidian text-ivory transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 opacity-100"
            aria-label="Anterior"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-obsidian/60 backdrop-blur-sm flex items-center justify-center hover:bg-gold/80 hover:text-obsidian text-ivory transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 opacity-100"
            aria-label="Siguiente"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === displayIndex ? "bg-gold w-4" : "bg-ivory/50 w-1.5"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function Properties({ properties }: { properties: Property[] }) {
  const t = useTranslations("properties");
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [activeTab, setActiveTab] = useState<"venta" | "arriendo">("venta");

  const ventas = properties.filter((p) => p.type === "venta");
  const arriendos = properties.filter((p) => p.type === "arriendo");
  const displayed = activeTab === "venta" ? ventas : arriendos;

  const hasBothTypes = ventas.length > 0 && arriendos.length > 0;

  return (
    <section id="properties" ref={ref} className="bg-obsidian py-10 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label mb-6">{t("label")}</p>
          <h2
            className="text-ivory text-4xl sm:text-5xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("title")}
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <p className="text-muted text-sm font-light max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Tabs */}
        {hasBothTypes && (
          <motion.div
            className="flex justify-center gap-0 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {(["venta", "arriendo"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border ${
                  activeTab === tab
                    ? "bg-gold text-obsidian border-gold"
                    : "bg-transparent text-muted border-border hover:text-ivory hover:border-ivory/40"
                }`}
              >
                {tab === "venta"
                  ? locale === "es" ? "En Venta" : "For Sale"
                  : locale === "es" ? "En Arriendo" : "For Rent"}
              </button>
            ))}
          </motion.div>
        )}

        {/* Property cards */}
        {displayed.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted text-sm">
              {locale === "es" ? "No hay propiedades disponibles." : "No properties available."}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayed.map((property, i) => {
              const title = locale === "es" ? property.title_es : property.title_en;
              const subtitle = locale === "es" ? property.subtitle_es : property.subtitle_en;
              const features = locale === "es" ? property.features_es : property.features_en;

              const whatsappMsg = encodeURIComponent(
                locale === "es"
                  ? `Hola Eva, me interesa la propiedad *${title}* en ${property.location} (UF ${property.price_uf.toLocaleString("es-CL")}). ¿Podemos conversar?`
                  : `Hi Eva, I'm interested in the property *${title}* in ${property.location} (UF ${property.price_uf.toLocaleString("es-CL")}). Can we talk?`
              );

              return (
                <motion.article
                  key={property.id}
                  className="group bg-card border border-border hover:border-gold/40 transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  {/* Image carousel */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-card-hover">
                    <PropertyCarousel images={property.images} alt={title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent pointer-events-none z-10" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-gold text-obsidian text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 font-medium">
                        {t("price_label")}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                      <p className="text-gold text-2xl font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                        UF {property.price_uf.toLocaleString("es-CL")}
                      </p>
                      <p className="text-ivory/60 text-xs mt-0.5">
                        $ {property.price_clp.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3
                      className="text-ivory text-xl font-medium mb-1 group-hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {title}
                    </h3>
                    <p className="text-gold/70 text-xs tracking-[0.12em] uppercase mb-4">{subtitle}</p>

                    <div className="flex items-center gap-2 mb-6">
                      <svg className="w-3 h-3 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-muted text-xs tracking-wider">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-6 pb-6 border-b border-border">
                      {[
                        { value: property.bedrooms, label: t("bedrooms") },
                        { value: property.bathrooms, label: t("bathrooms") },
                        { value: property.total_m2, label: t("m2") },
                        { value: property.parking, label: t("parking") },
                      ].map((spec, j) => (
                        <div key={j} className="text-center">
                          <p className="text-ivory text-lg font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
                            {spec.value}
                          </p>
                          <p className="text-muted text-[0.6rem] tracking-wider uppercase">{spec.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <p className="text-muted text-[0.65rem] tracking-[0.2em] uppercase mb-3">{t("features")}</p>
                      <div className="flex flex-wrap gap-2">
                        {features.slice(0, 4).map((f, j) => (
                          <span key={j} className="text-ivory/60 text-[0.65rem] border border-border px-2 py-1 tracking-wide">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/${locale === "es" ? "" : locale + "/"}propiedades/${property.slug}`}
                        className="flex-1 text-center border border-gold text-gold text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-gold hover:text-obsidian transition-all duration-300 font-medium"
                      >
                        {t("cta")}
                      </Link>
                      <a
                        href={`https://wa.me/56984294478?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("whatsapp")}
                        className="flex items-center justify-center w-12 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 flex-shrink-0"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
