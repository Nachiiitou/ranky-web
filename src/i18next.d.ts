import "i18next";
import type en from "./en.json";

// Ajusta el namespace y las claves basadas en tu JSON
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof en;
    };
  }
}
