import i18next from "i18next";
import viTranslations from "./locales/vi.json";
import enTranslations from "./locales/en.json";

export const defaultNS = "translation";
export const resources = {
  vi: {
    translation: viTranslations,
  },
  en: {
    translation: enTranslations,
  },
} as const;

// Register Vietnamese & English bundles into i18next
if (typeof i18next.addResourceBundle === "function") {
  i18next.addResourceBundle("vi", "translation", viTranslations, true, true);
  i18next.addResourceBundle("en", "translation", enTranslations, true, true);

  // If language is not set or set to Vietnamese, apply vi
  if (!i18next.language) {
    i18next.changeLanguage("vi");
  }
}

export default i18next;
