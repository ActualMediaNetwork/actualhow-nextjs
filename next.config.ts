import { NextConfig } from "next";
type RemotePattern = {
  protocol?: "http" | "https";
  hostname: string;
  pathname?: string;
};

/**
 * Convierte REMOTE_PATTERNS (CSV) en images.remotePatterns sin puertos.
 * Admite:
 *   - api.actualhow.com
 *   - actualhow.com
 *   - https://img.foo.com/photos/*
 *   - http://assets.bar.net/static
 * Cualquier puerto (p. ej. :8080) será ignorado.
 */
function parseRemotePatterns(csv?: string): RemotePattern[] {
  const items = (csv || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const out: RemotePattern[] = [];

  for (const raw of items) {
    // Si no viene protocolo, asumimos https://
    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
      const u = new URL(candidate);

      // URL.hostname **no incluye puerto**, así que ya lo estamos ignorando
      const hostname = u.hostname;

      // Normaliza pathname → "/**" por defecto; si no hay wildcard, se añade "/**"
      let pathname = u.pathname && u.pathname !== "/" ? u.pathname : "/**";
      if (!pathname.includes("*")) {
        pathname = pathname.replace(/\/?$/, "/**");
      }

      const pattern: RemotePattern = {
        protocol: (u.protocol.replace(":", "") as "http" | "https") || "https",
        hostname,
        pathname,
      };

      // Deduplicar sin puerto
      const key = `${pattern.protocol}://${pattern.hostname}${pattern.pathname}`;
      if (
        !out.some((p) => `${p.protocol}://${p.hostname}${p.pathname}` === key)
      ) {
        out.push(pattern);
      }
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[next.config] REMOTE_PATTERNS item inválido: "${raw}"`);
      }
    }
  }

  return out;
}

const remotePatterns = parseRemotePatterns(process.env.REMOTE_PATTERNS);

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
