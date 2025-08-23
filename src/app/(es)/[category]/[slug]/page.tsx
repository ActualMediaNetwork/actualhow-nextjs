import { locale } from "../../locale";
import Post from "@/theme/actualapp/pages/Post";
import {
  PostGenerateMetadata,
  PostGenerateStaticParams,
  PostPageLogicRender,
  SchemaJSON,
} from "wpnextjs-headless-next-base";

interface PostParams {
  category: string;
  slug: string;
}

export const revalidate = 2000000;

export async function generateStaticParams() {
  return PostGenerateStaticParams({ locale, apiUrl: process.env.WP_API_URL! });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostParams>;
}) {
  const { slug } = await params;
  return PostGenerateMetadata({
    locale,
    slug: slug,
    apiUrl: process.env.WP_API_URL!,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<PostParams>;
}) {
  const { category, slug } = await params;
  const { p, relatedPosts } = await PostPageLogicRender({
    locale,
    categoryFromUrl: category,
    slug,
    apiUrl: process.env.WP_API_URL!,
  });
  console.log({ category });
  return (
    <>
      {p.yoast_head && <SchemaJSON metaInfo={p.yoast_head} />}
      <Post post={p} relatedPosts={relatedPosts} locale={locale} />
    </>
  );
}
