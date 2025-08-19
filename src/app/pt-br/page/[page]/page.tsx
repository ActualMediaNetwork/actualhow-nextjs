import { locale } from "../../locale";
import { t } from "@/app/i18n";
import PostsList from "@/theme/actualapp/components/PostsList";
import {
  HomePaginatedGenerateMetadata,
  HomePaginatedGenerateStaticParams,
  HomePaginatedPageLogicRender,
  Pagination,
  SchemaJSON,
} from "wpnextjs-headless-next-base";

interface HomePaginatedParams {
  page: string;
}
export const revalidate = 86400;

export async function generateStaticParams() {
  return HomePaginatedGenerateStaticParams({
    locale,
    apiUrl: process.env.WP_API_URL!,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<HomePaginatedParams>;
}) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  const texts = {
    title: `${t("common.page", locale)} ${page} - ${process.env.SITE_NAME}`,
    description: `${t("common.paginatedText", locale, { page })}`,
  };
  return HomePaginatedGenerateMetadata({
    page: pageNum,
    locale,
    texts,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<HomePaginatedParams>;
}) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  const { posts, totalPages } = await HomePaginatedPageLogicRender({
    locale,
    page: pageNum,
    apiUrl: process.env.WP_API_URL!,
  });
  return (
    <>
      {posts[0]?.yoast_head && <SchemaJSON metaInfo={posts[0].yoast_head} />}
      <PostsList
        posts={posts}
        columns={3}
        title={`${t("common.page", locale)} ${pageNum}`}
        ads
        padding
      />
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        locale={locale}
      />
    </>
  );
}
