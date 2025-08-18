// Asegúrate de tener TS >= 4.9 (para `satisfies`)
import type React from "react";

export type Locale = "en" | "es";

// Diccionario recursivo: cada clave es string y su valor puede ser otro objeto o un string
export type Messages = { [k: string]: string | Messages };

export interface I18n {
  locale: Locale;
  // Usa el tipo real de React para que encaje con useState
  setLocale: React.Dispatch<React.SetStateAction<Locale>>;
  t: (key: string, params?: Record<string, string | number>) => string;
}
