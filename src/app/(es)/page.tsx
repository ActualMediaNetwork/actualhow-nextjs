import Home from "@/theme/actualapp/pages/Home";
import { locale } from "./locale";
import {
  HomePageGenerateMetaData,
  HomePageLogicRender,
  Pagination,
  SchemaJSON,
} from "wpnextjs-headless-next-base";

export const revalidate = 86400;

export async function generateMetadata() {
  return HomePageGenerateMetaData({ locale, apiUrl: process.env.WP_API_URL! });
}

export default async function Page() {
  const { page, totalPages, posts } = await HomePageLogicRender({
    locale,
    apiUrl: process.env.WP_API_URL!,
  });

  return (
    <>
      {page[0]?.yoast_head && <SchemaJSON metaInfo={page[0]?.yoast_head} />}
      <Home posts={posts} />
      <Pagination currentPage={1} totalPages={totalPages} locale={locale} />
    </>
  );
}
