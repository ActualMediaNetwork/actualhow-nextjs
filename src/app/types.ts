import { WPYoastHeadJson } from "wpjs-api";

export type GetMetaDataProps = {
  data: WPYoastHeadJson;
  customCanonical?: string;
  translations?: Record<string, string>;
};

export interface YoastHead {
  canonical: string;
  og_locale: string;
  og_site_name: string;
  og_title: string;
  og_type: string;
  og_description: string;
  og_url: string;
  robots: Record<string, string>;
  title: string;
}

export type RobotsDirectives = {
  index: boolean;
  follow: boolean;
  "max-snippet"?: number;
  "max-image-preview"?: "none" | "standard" | "large";
  "max-video-preview"?: number;
};

export const OG_TYPES = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
] as const;

export type OGType = (typeof OG_TYPES)[number];

export type ImagePreview = "none" | "standard" | "large";

export type LocaleValues = "es" | "en" | "de" | "pt-br" | "fr";
export type LocaleProps = { locale?: LocaleValues };
