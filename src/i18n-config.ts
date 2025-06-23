
export const locales = ["en", "fr", "es"];
export const defaultLocale = "en";

export function isValidLocale(locale: string): boolean {
  return (locales as readonly string[]).includes(locale);
}
