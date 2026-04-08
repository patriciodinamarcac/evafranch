"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";

export default function Process() {
  const t = useTranslations("process");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      num: t("step1_num"),
      title: t("step1_title"),
      desc: t("step1_desc"),
    },
    {
      num: t("step2_num"),
      title: t("step2_title"),
      desc: t("step2_desc"),
    },
    {
      num: t("step3_num"),
      title: t("step3_title"),
      desc: t("step3_desc"),
    },
  ];

  return (
    <section
      id="process"
      ref={ref}
      className="relative bg-dark py-10 lg:py-40 overflow-hidden"
    >
      {/* Eva B&W photo as background — left side */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* Mobile: centered, fades bottom */}
        <img
          src="/eva/eva-bw.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          style={{
            objectPosition: "20% 10%",
            opacity: 0.35,
            maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 85%)",
          }}
        />
        {/* Desktop: left-aligned, horizontal fade */}
        <img
          src="/eva/eva-bw.jpg"
          alt=""
          className="absolute left-0 top-0 h-full w-auto max-w-none object-cover object-top hidden md:block"
          style={{
            opacity: 0.25,
            maskImage: "linear-gradient(to right, black 20%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to right, black 20%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
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

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center text-center md:items-start md:text-left"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              {/* Step number circle */}
              <div className="relative mb-8">
                <div className="w-16 h-16 border border-gold flex items-center justify-center bg-dark relative z-10">
                  <span
                    className="text-gold text-2xl font-light"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {step.num}
                  </span>
                </div>
                {/* Gold dot */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gold" />
              </div>

              <h3
                className="text-ivory text-2xl font-medium mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {step.title}
              </h3>

              <div className="w-8 h-px bg-gold mb-5" />

              <p className="text-muted text-sm leading-relaxed font-light">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
