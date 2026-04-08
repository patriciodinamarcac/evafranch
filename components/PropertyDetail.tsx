"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Property } from "@/lib/supabase/types";

interface Props {
  property: Property;
  locale: string;
}

export default function PropertyDetail({ property, locale }: Props) {
  const t = useTranslations("property");
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const title = locale === "es" ? property.title_es : property.title_en;
  const subtitle = locale === "es" ? property.subtitle_es : property.subtitle_en;
  const description = locale === "es" ? property.description_es : property.description_en;
  const features = locale === "es" ? property.features_es : property.features_en;

  const whatsappMsg = encodeURIComponent(
    locale === "es"
      ? `Hola Eva, me interesa la propiedad *${title}* en ${property.location} (UF ${property.price_uf.toLocaleString("es-CL")}). ¿Podemos conversar?`
      : `Hi Eva, I'm interested in the property *${title}* in ${property.location} (UF ${property.price_uf.toLocaleString("es-CL")}). Can we talk?`
  );

  return (
    <div className="min-h-screen bg-dark">
      {/* Back nav */}
      <div className="bg-obsidian border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center gap-3">
          <Link
            href={`/${locale === "es" ? "" : locale}#properties`}
            className="text-muted text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors flex items-center gap-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("back")}
          </Link>
          <span className="text-border">/</span>
          <span className="text-muted text-xs">{title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT: Gallery */}
          <div>
            {/* Main image */}
            <div
              className="relative aspect-[4/3] bg-card overflow-hidden cursor-zoom-in mb-3"
              onClick={() => setLightbox(true)}
            >
              {property.images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={property.images[activeImage]}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted text-sm">Sin fotos</span>
                </div>
              )}

              {/* Image counter */}
              {property.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-obsidian/80 text-ivory text-xs px-3 py-1">
                  {activeImage + 1} / {property.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {property.images.slice(0, 10).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square overflow-hidden transition-all duration-200 ${
                      i === activeImage ? "ring-2 ring-gold" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {property.video_url && (
              <div className="mt-6">
                <p className="text-muted text-[0.65rem] tracking-[0.2em] uppercase mb-3">{t("video")}</p>
                <div className="relative aspect-video bg-card overflow-hidden">
                  <video
                    src={property.video_url}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="lg:sticky lg:top-8">
            {/* Type badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gold text-obsidian text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 font-medium">
                {property.type === "venta" ? t("for_sale") : t("for_rent")}
              </span>
              <span className="text-muted text-xs tracking-wider">{property.location}</span>
            </div>

            <h1
              className="text-ivory text-3xl sm:text-4xl font-medium leading-tight mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {title}
            </h1>
            <p className="text-gold/70 text-sm tracking-[0.12em] uppercase mb-6">{subtitle}</p>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-border">
              <p
                className="text-gold text-4xl font-medium"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                UF {property.price_uf.toLocaleString("es-CL")}
              </p>
              <p className="text-muted text-sm mt-1">
                $ {property.price_clp.toLocaleString("es-CL")}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-4 gap-4 mb-8 pb-8 border-b border-border">
              {[
                { value: property.bedrooms, label: t("bedrooms") },
                { value: property.bathrooms, label: t("bathrooms") },
                { value: `${property.total_m2}`, label: t("m2") },
                { value: property.parking, label: t("parking") },
              ].map((spec, i) => (
                <div key={i} className="text-center">
                  <p
                    className="text-ivory text-2xl font-medium"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {spec.value}
                  </p>
                  <p className="text-muted text-[0.6rem] tracking-wider uppercase mt-1">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-8 pb-8 border-b border-border">
                <p className="text-muted text-[0.65rem] tracking-[0.2em] uppercase mb-4">{t("description")}</p>
                <p className="text-ivory/70 text-sm leading-relaxed font-light">{description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8 pb-8 border-b border-border">
                <p className="text-muted text-[0.65rem] tracking-[0.2em] uppercase mb-4">{t("features")}</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span
                      key={i}
                      className="text-ivory/60 text-[0.65rem] border border-border px-3 py-1.5 tracking-wide"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/56984294478?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] text-xs tracking-[0.15em] uppercase px-6 py-4 hover:bg-[#25D366]/20 transition-all duration-300"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("whatsapp_cta")}
              </a>

              {property.portal_link && (
                <a
                  href={property.portal_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border border-gold text-gold text-xs tracking-[0.2em] uppercase px-6 py-4 hover:bg-gold hover:text-obsidian transition-all duration-300 font-medium"
                >
                  {t("portal_cta")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        {property.lat && property.lng && (
          <div className="mt-16">
            <p className="text-muted text-[0.65rem] tracking-[0.2em] uppercase mb-4">{t("location")}</p>
            <div className="h-64 bg-card border border-border flex items-center justify-center">
              <a
                href={`https://maps.google.com/?q=${property.lat},${property.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 text-muted hover:text-gold transition-colors"
              >
                <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{property.location}</span>
                <span className="text-xs tracking-wider underline">{t("open_map")}</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-obsidian/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 text-muted hover:text-ivory text-3xl leading-none"
              onClick={() => setLightbox(false)}
            >
              ×
            </button>
            <div
              className="relative w-full max-w-4xl aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={property.images[activeImage]}
                alt={title}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            {property.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian/60 flex items-center justify-center text-ivory hover:text-gold transition-colors"
                  onClick={(e) => { e.stopPropagation(); setActiveImage((a) => (a - 1 + property.images.length) % property.images.length); }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian/60 flex items-center justify-center text-ivory hover:text-gold transition-colors"
                  onClick={(e) => { e.stopPropagation(); setActiveImage((a) => (a + 1) % property.images.length); }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
