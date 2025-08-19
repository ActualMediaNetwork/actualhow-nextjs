// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const mainSitemap = process.env.SITEMAP_URL?.replace(/\/+$/, "");

  const newsSitemap = process.env.NEWS_SITEMAP_URL?.replace(/\/+$/, "");

  const sitemaps = [mainSitemap, newsSitemap].filter(Boolean) as string[];

  return {
    sitemap: sitemaps,
    rules: {
      userAgent: "*",
    },
  };
}
