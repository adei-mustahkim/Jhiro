export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromRequest(request: Request): Locale {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0].split("-")[0];
    if (isValidLocale(preferred)) {
      return preferred;
    }
  }
  return defaultLocale;
}
