import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./es.json";
import en from "./en.json";

// Recurso con un único namespace ("common")
export const resources = {
  es: { common: es },
  en: { common: en },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: "common",
    ns: ["common"],

    // Idiomas que soportas
    supportedLngs: ["es", "en"],

    // Si el navegador detecta 'en-US' o 'es-MX', que use 'en' o 'es'
    fallbackLng: "es",
    nonExplicitSupportedLngs: true, // <- importante si vienes con 'en-US', 'es-ES', etc.
    load: "languageOnly",

    interpolation: { escapeValue: false },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
