import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed", // Spanish at /, English at /en
  localeDetection: false, // Always use Spanish by default, don't auto-detect browser language
});
