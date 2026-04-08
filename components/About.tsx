"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";

export default function About() {
  const t = useTranslations("about");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: t("stat1_value"), label: t("stat1_label") },
    { value: t("stat2_value"), label: t("stat2_label") },
    { value: t("stat3_value"), label: t("stat3_label") },
  ];

  return (
    <section id="about" ref={ref} className="bg-dark pt-4 pb-4 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-24 items-center">
          {/* Photo side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Gold frame effect — hidden on small screens to avoid clipping */}
            <div className="hidden sm:block absolute -inset-4 border border-gold/20 rounded-none pointer-events-none z-10" />
            <div className="hidden sm:block absolute -top-4 -left-4 w-20 h-20 border-t border-l border-gold z-20" />
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-20 h-20 border-b border-r border-gold z-20" />

            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/eva/eva-about-bw2.jpg"
                alt="Eva Franch Castells"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 bg-gold text-obsidian px-6 py-4 z-30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-xs font-medium tracking-[0.15em] uppercase">Agente</p>
              <p
                className="text-lg font-medium"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                RE/MAX
              </p>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            className="lg:pl-8 mt-3 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="section-label mb-3">{t("label")}</p>

            <h2
              className="text-ivory text-4xl sm:text-5xl font-medium leading-tight mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("title")}
            </h2>

            <div className="w-12 h-px bg-gold mb-8" />

            <p className="text-ivory/60 text-base leading-relaxed mb-6 font-light">
              {t("bio1")}
            </p>

            <p className="text-ivory/60 text-base leading-relaxed mb-12 font-light">
              {t("bio2")}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-border pt-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                >
                  <p
                    className="text-gold text-2xl font-medium mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-muted text-xs tracking-[0.12em] uppercase font-light">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
