"use client";

import { useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";

const FADE_DURATION = 1200; // ms for fade out + fade in
const CUT_BEFORE_END = 3;   // seconds before end to start fade

export default function Hero() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingRef = useRef(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || fadingRef.current) return;

    if (video.currentTime >= video.duration - CUT_BEFORE_END) {
      fadingRef.current = true;

      // Fade to black
      setFadeOpacity(1);

      setTimeout(() => {
        // Reset to start while black
        if (videoRef.current) videoRef.current.currentTime = 0;

        // Fade back in
        setFadeOpacity(0);

        setTimeout(() => {
          fadingRef.current = false;
        }, FADE_DURATION / 2);
      }, FADE_DURATION / 2);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const scrollToProperties = () => {
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen min-h-[700px] overflow-hidden bg-obsidian"
    >
      <motion.div
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{ y: videoY }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-[42%_center]"
onTimeUpdate={handleTimeUpdate}
        >
          <source src="/videos/drone.webm" type="video/webm" />
          <source src="/videos/drone.mp4" type="video/mp4" />
        </video>

        {/* Fade overlay for loop transition */}
        <div
          className="absolute inset-0 bg-obsidian z-10 pointer-events-none"
          style={{
            opacity: fadeOpacity,
            transition: `opacity ${FADE_DURATION / 2}ms ease-in-out`,
          }}
        />

        {/* Permanent overlays */}
        <div className="absolute inset-0 bg-obsidian/60 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-transparent z-0" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="w-8 h-px bg-gold" />
          <span className="section-label">{t("location")}</span>
          <span className="w-8 h-px bg-gold" />
        </motion.div>

        <motion.h1
          className="text-ivory font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-none tracking-wide mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Eva Franch
        </motion.h1>

        <motion.h1
          className="text-gold font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-none tracking-wide mb-10"
          style={{ fontFamily: "var(--font-playfair)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Castells
        </motion.h1>

        <motion.div
          className="w-16 h-px bg-gold mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        />

        <motion.p
          className="text-ivory/70 text-sm sm:text-base tracking-[0.2em] uppercase font-light max-w-md mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {t("tagline")}
        </motion.p>

        <motion.button
          onClick={scrollToProperties}
          className="group relative border border-gold text-gold text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-gold hover:text-obsidian transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="relative z-10">{t("cta")}</span>
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{ opacity: textOpacity }}
      >
        <span className="section-label text-[0.6rem]">{t("scroll")}</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
