import {
  CategoryGenerateMetadata,
  CategoryGenerateStaticParams,
  CategoryPageLogicRender,
  Pagination,
  SchemaJSON,
} from "wpnextjs-headless-next-base";
import { locale } from "../locale";
import PostsList from "@/theme/actualapp/components/PostsList";

interface CategoryParams {
  category: string;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return CategoryGenerateStaticParams({
    locale,
    apiUrl: process.env.WP_API_URL!,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryParams>;
}) {
  const { category } = await params;
  return CategoryGenerateMetadata({
    locale,
    category: category,
    apiUrl: process.env.WP_API_URL!,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<CategoryParams>;
}) {
  const { category } = await params;

  const { yoast_head, posts, name, description, totalPages } =
    await CategoryPageLogicRender({
      locale,
      category: category,
      apiUrl: process.env.WP_API_URL!,
    });

  return (
    <>
      {yoast_head && <SchemaJSON metaInfo={yoast_head} />}
      <PostsList
        posts={posts}
        padding
        title={name}
        description={description}
        ads
      />
      <Pagination
        currentPage={1}
        totalPages={totalPages}
        slug={category}
        locale={locale}
      />
    </>
  );
}
