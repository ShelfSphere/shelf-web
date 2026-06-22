import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const LOCALES = ["en", "ru", "hy"] as const;
type Locale = (typeof LOCALES)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value ?? "en";
  const locale: Locale = (LOCALES as readonly string[]).includes(lang)
    ? (lang as Locale)
    : "en";

  const messages = (
    await { en: () => import("../../messages/en.json"),
             ru: () => import("../../messages/ru.json"),
             hy: () => import("../../messages/hy.json") }[locale]()
  ).default;

  return { locale, messages };
});
