// i18n.ts
import rawTranslations from "@/app/translations.json";

export type Locales = "es" | "en" | "de" | "fr" | "pt-br";
export const SUPPORTED_LANGS = ["en", "de", "pt-br", "fr", "es"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LOCALE: Locales = "es";

// Diccionario recursivo: hojas = string
type Dict = { [k: string]: string | Dict };
type Translations = Record<Locales, Dict>;

const translations: Translations = rawTranslations as Translations;

function getByPath(obj: Dict | undefined, path: string): string | undefined {
  if (!obj) return undefined;
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in (cur as object)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

/** Reemplaza {placeholders} por params[k]. Si falta, deja {k}. */
function interpolate(
  str: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = params[k];
    return v === null || v === undefined ? `{${k}}` : String(v);
  });
}

export function t(
  key: string,
  locale: Locales,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  const val =
    getByPath(translations[locale], key) ??
    getByPath(translations[DEFAULT_LOCALE], key) ??
    key;
  return interpolate(val, params);
}
