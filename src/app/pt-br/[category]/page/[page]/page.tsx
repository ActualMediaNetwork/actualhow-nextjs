import {
  CategoryPaginatedGenerateMetadata,
  CategoryPaginatedGenerateStaticParams,
  CategoryPaginatedPageLogicRender,
  Pagination,
  SchemaJSON,
} from "wpnextjs-headless-next-base";
import { locale } from "../../../locale";
import PostsList from "@/theme/actualapp/components/PostsList";
import { t } from "@/app/i18n";

export const revalidate = 86400;

export async function generateStaticParams() {
  return CategoryPaginatedGenerateStaticParams({
    locale,
    apiUrl: process.env.WP_API_URL!,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return CategoryPaginatedGenerateMetadata({
    locale,
    category,
    apiUrl: process.env.WP_API_URL!,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;
  const currentPage = Number(page);
  const { yoast_head, posts, description, totalPages, name } =
    await CategoryPaginatedPageLogicRender({
      locale,
      category,
      page: currentPage,
      apiUrl: process.env.WP_API_URL!,
    });

  return (
    <>
      {yoast_head && <SchemaJSON metaInfo={yoast_head} />}
      <PostsList
        posts={posts}
        padding
        title={`${name} - ${t("common.page", locale)} ${page}`}
        description={description}
        ads
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        slug={category}
        locale={locale}
      />
    </>
  );
}
