import {
  LegalGenerateMetadata,
  LegalGenerateStaticParams,
  LegalPageLogicRender,
  SchemaJSON,
} from "wpnextjs-headless-next-base";
import { locale, parentLegalId } from "../../locale";
import Page from "@/theme/actualapp/pages/Page";

interface LegalParams {
  page: string;
}

export const revalidate = 2000000;

export async function generateStaticParams() {
  return LegalGenerateStaticParams({
    legalId: parentLegalId,
    locale,
    apiUrl: process.env.WP_API_URL!,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LegalParams>;
}) {
  const { page: currentPage } = await params;
  return LegalGenerateMetadata({
    slug: currentPage,
    locale,
    apiUrl: process.env.WP_API_URL!,
  });
}

export default async function PageRender({
  params,
}: {
  params: Promise<LegalParams>;
}) {
  const { page: currentPage } = await params;

  const { page: renderPage } = await LegalPageLogicRender({
    slug: currentPage,
    locale,
    apiUrl: process.env.WP_API_URL!,
  });

  return (
    <>
      {renderPage[0]?.yoast_head && (
        <SchemaJSON metaInfo={renderPage[0]?.yoast_head} />
      )}

      <Page page={renderPage[0]} />
    </>
  );
}
