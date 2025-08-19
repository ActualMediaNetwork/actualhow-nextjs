// app/news-sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { getPosts, type WPPost } from "wpjs-api";
import { Locales, SUPPORTED_LANGS } from "../i18n";
import { convertAPIUrlByFrontDomain } from "wpnextjs-headless-next-base";
import { format } from "date-fns";

export const revalidate = 900;

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "es";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const WP_API = process.env.WP_API_URL!;
  const afterISO = new Date(Date.now() - 48 * 60 * 60 * 1e3).toISOString();

  // Posts recientes (48h) por idioma
  async function fetchRecent(lang: Locales): Promise<WPPost[]> {
    return getPosts(WP_API, {
      per_page: 100,
      after: afterISO,
      lang,
      status: "publish",
    });
  }

  const normLang = (s: string) => s.toLowerCase(); // para lógica interna
  const normalizeHreflang = (lng: string) => {
    // para xhtml:link
    const lower = lng.toLowerCase();
    const parts = lower.split("-");
    return parts.length > 1 ? `${parts[0]}-${parts[1].toUpperCase()}` : lower;
  };
  const normalizeNewsLang = (lng: string) => lng.split("-")[0].toLowerCase(); // para <news:language>

  // Construye variantes a partir de link propio + translations
  function buildVariants(p: WPPost, langOfThisPost: string) {
    const t = (p as WPPost)?.translations as Record<string, string> | undefined;
    const variants = new Map<string, string>();

    if (p.link) variants.set(normLang(langOfThisPost), p.link);
    if (t && typeof t === "object") {
      for (const [lng, href] of Object.entries(t)) {
        if (href) variants.set(normLang(lng), href);
      }
    }

    const entries = [...variants.entries()].map(([lng, href]) => [
      lng,
      convertAPIUrlByFrontDomain(href, siteUrl),
    ]) as Array<[string, string]>;

    const langsSorted = entries.map(([l]) => l).sort();
    const primary =
      entries.find(([l]) => l === normLang(DEFAULT_LOCALE))?.[0] ??
      langsSorted[0];

    return { entries, primary };
  }

  // 1) Cargamos posts por idioma en paralelo
  const perLang = await Promise.all(
    SUPPORTED_LANGS.map(async (lang) => ({
      lang,
      posts: await fetchRecent(lang as Locales),
    }))
  );

  // 1.1) Índice: href (front) -> WPPost de esa variante
  const postByHref = new Map<string, WPPost>();
  for (const { posts } of perLang) {
    for (const p of posts) {
      if (!p?.link) continue;
      const href = convertAPIUrlByFrontDomain(p.link, siteUrl);
      postByHref.set(href, p);
    }
  }

  // 2) Evitar duplicados por grupo de traducciones
  const processedGroups = new Set<string>();
  const items: string[] = [];

  for (const { lang, posts } of perLang) {
    for (const p of posts) {
      const { entries, primary } = buildVariants(p, lang);

      const groupKey = entries
        .map(([, href]) => href)
        .sort()
        .join("|");
      if (processedGroups.has(groupKey)) continue;
      if (normLang(lang) !== primary) continue;
      processedGroups.add(groupKey);

      // Alternates solo si hay >1 variante
      const primaryHref =
        entries.find(([l]) => l === primary)?.[1] ?? entries[0][1];

      let alternates = "";
      if (entries.length > 1) {
        alternates =
          entries
            .map(
              ([lng, href]) =>
                `<xhtml:link rel="alternate" hreflang="${normalizeHreflang(
                  lng
                )}" href="${href}"/>`
            )
            .join("\n    ") +
          `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${primaryHref}"/>`;
      }

      // Emitimos una <url> por cada variante (News sitemap)
      for (const [lng, href] of entries) {
        const variant = postByHref.get(href) ?? p; // título/fecha de la variante si existe

        const publicationDate =
          (variant as WPPost)?.date ??
          (variant as WPPost)?.modified ??
          new Date().toISOString();

        const rawTitle =
          (variant as WPPost)?.title?.rendered ??
          (typeof (variant as WPPost)?.title === "string"
            ? (variant as WPPost).title
            : "") ??
          "";

        const safeTitle = String(rawTitle).replace(/]]>/g, "]]]]><![CDATA[>");

        items.push(
          `
  <url>
    <loc>${href}</loc>
    ${alternates}
    <news:news>
      <news:publication>
        <news:name>${process.env.SITE_NAME}</news:name>
        <news:language>${normalizeNewsLang(lng)}</news:language>
      </news:publication>
      <news:publication_date>${format(
        publicationDate,
        "yyyy-MM-dd"
      )}</news:publication_date>
      <news:title><![CDATA[${safeTitle}]]></news:title>
    </news:news>
  </url>`.trim()
        );
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
