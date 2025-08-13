/* eslint react-refresh/only-export-components: ["warn", { "allowExportNames": ["useI18n"] }] */

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { I18n, Locale, Messages } from "./types";
import { DEFAULT_LOCALE, STORAGE_KEY } from "./config";
import es from "./es.json";
import en from "./en.json";

// fuerza el tipo por si el JSON se infiere como {}
const dicts = { es, en } as Record<Locale, Messages>;

// acceso profundo "a.b.c" (sin any)
function getDeep(obj: Messages, path: string): string | Messages | undefined {
  const result = path.split(".").reduce<unknown>((acc, k) => {
    if (acc && typeof acc === "object" && k in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
  return (typeof result === "string" || typeof result === "object") ? (result as string | Messages) : undefined;
}

// interpolación "Hola, {name}"
function interpolate(str: string, params?: Record<string, string | number>) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    Object.prototype.hasOwnProperty.call(params, k) ? String(params[k]) : `{${k}}`,
  );
}

const I18nCtx = createContext<I18n | null>(null);

export function I18nProvider({
  initial = DEFAULT_LOCALE,
  children,
}: {
  initial?: Locale;
  children: React.ReactNode;
}) {
  const saved =
    (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Locale | null)) ||
    null;

  const [locale, setLocale] = useState<Locale>(saved || initial);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const value = useMemo<I18n>(() => {
    return {
      locale,
      setLocale,
      t: (key: string, params?: Record<string, string | number>) => {
        const val = getDeep(dicts[locale], key);
        if (typeof val === "string") return interpolate(val, params);

        const fb = getDeep(dicts.en, key);
        if (typeof fb === "string") return interpolate(fb, params);

        return key;
      },
    };
  }, [locale]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
