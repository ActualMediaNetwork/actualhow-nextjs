// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, WPPost } from "wpjs-api";
import { DEFAULT_LOCALE, SUPPORTED_LANGS } from "./i18n";
import { convertAPIUrlByFrontDomain } from "wpnextjs-headless-next-base";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.FRONT_DOMAIN!;
  const WP_API = process.env.WP_API_URL!;

  //HomeURLS

  const homeURLS = SUPPORTED_LANGS.map((lang) => {
    return lang !== DEFAULT_LOCALE ? lang : "";
  });

  // --- categorías (solo DEFAULT_LOCALE; ajusta si quieres por idioma) ---
  const categoriesByLang = await Promise.all(
    SUPPORTED_LANGS.map(async (lang) => {
      const categories = await getCategories(WP_API, {
        per_page: 100,
        lang,
      });

      return categories.map((cat) => {
        return `${siteUrl}/${lang !== DEFAULT_LOCALE ? `${lang}/` : ``}${
          cat.slug
        }`;
      });
    })
  );

  const allCategoryUrls = categoriesByLang.flat();

  // --- posts de TODOS los idiomas (con campos necesarios) ---
  const perLang = await Promise.all(
    SUPPORTED_LANGS.map(async (lang) => {
      const posts = await getAllPosts(WP_API, {
        _fields: ["id", "slug", "modified", "translations", "link"],
        lang,
        status: "publish",
      });
      return { lang, posts };
    })
  );

  // --- agrupar variantes por post (clave = set de URLs de front ordenadas) ---
  type Group = {
    variants: Record<string, string>; // lang -> href (front)
    lastModified: Date; // el más reciente del grupo
  };

  const groups = new Map<string, Group>();

  const toFront = (href: string) => convertAPIUrlByFrontDomain(href, siteUrl);

  for (const { lang, posts } of perLang) {
    for (const p of posts) {
      const variants: Record<string, string> = {};
      // propia URL del post
      if ((p as WPPost).link) variants[lang] = toFront((p as WPPost).link);

      // traducciones (tu API las da como { lang: urlCompleta })
      const t = (p as WPPost)?.translations as
        | Record<string, string>
        | undefined;
      if (t && typeof t === "object") {
        for (const [lng, url] of Object.entries(t)) {
          if (url) variants[lng] = toFront(url);
        }
      }

      // clave del grupo = urls ordenadas
      const hrefs = Object.values(variants).sort();
      if (!hrefs.length) continue;
      const groupKey = hrefs.join("|");

      // lastModified del post actual
      const lm = (p as WPPost)?.modified
        ? new Date((p as WPPost).modified)
        : new Date();

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          variants: { ...variants },
          lastModified: lm,
        });
      } else {
        const g = groups.get(groupKey)!;
        // merge variants
        for (const [k, v] of Object.entries(variants)) g.variants[k] = v;
        // conserva el más reciente
        if (lm > g.lastModified) g.lastModified = lm;
      }
    }
  }

  // --- construir entradas del sitemap (una por grupo) ---
  const postEntries: MetadataRoute.Sitemap = [];

  const normalizeHreflang = (lng: string) =>
    lng.includes("-")
      ? `${lng.split("-")[0]}-${lng.split("-")[1].toUpperCase()}`
      : lng;

  for (const { variants, lastModified } of groups.values()) {
    // canónica = DEFAULT_LOCALE si existe; si no, la primera
    const canonicalLang = variants[DEFAULT_LOCALE]
      ? DEFAULT_LOCALE
      : Object.keys(variants).sort()[0];
    const canonicalUrl = variants[canonicalLang];

    const entries = Object.entries(variants).map(
      ([lng, href]) => [normalizeHreflang(lng), href] as const
    );
    if (entries.length > 1) {
      // Hay varias lenguas -> incluimos hreflang + x-default
      const languages: Record<string, string> = {};
      for (const [lng, href] of entries) languages[lng] = href;
      languages["x-default"] = canonicalUrl;

      postEntries.push({
        url: canonicalUrl,
        lastModified,
        alternates: { languages },
      });
    } else {
      // Solo un idioma -> sin alternates
      postEntries.push({
        url: canonicalUrl,
        lastModified,
      });
    }
  }

  // --- ensamblado final ---
  const urls: MetadataRoute.Sitemap = [
    // home (solo DEFAULT_LOCALE)
    ...homeURLS.map((url) => ({
      url: `${siteUrl}/${url}`,
    })),

    // categorías (solo DEFAULT_LOCALE)
    ...allCategoryUrls.map((cat) => ({
      url: cat,
    })),

    // posts con alternates
    ...postEntries,
  ];

  return urls;
}
