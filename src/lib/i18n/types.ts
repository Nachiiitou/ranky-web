export type Locale = "es" | "en";

export type Messages = {
  [key: string]: string | Messages; // permite anidar objetos
};

export interface I18n {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (l: Locale) => void;
}
