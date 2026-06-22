import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "hy"],
  defaultLocale: "en",
  localePrefix: "as-needed", // default locale (en) has no prefix → / works directly
});

export type Locale = (typeof routing.locales)[number];
