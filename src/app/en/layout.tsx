import "@/app/globals.css";
import { locale, menusIds } from "./locale";
import ThemeLayout from "@/theme/actualapp/layout";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  AdSenseLoader,
  AnalyticsHandler,
  AutoAdsRefresh,
  getLayoutMenus,
} from "wpnextjs-headless-next-base";

export default async function EsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { headerMenu, footerMenu } = await getLayoutMenus({
    menusIds,
    user: process.env.WP_USERNAME!,
    password: process.env.WP_PASSWORD!,
    apiUrl: process.env.WP_API_URL!,
  });
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <AdSenseLoader />
      </head>
      <body>
        <>
          <ThemeLayout
            headerMenu={headerMenu}
            footerMenu={footerMenu}
            locale={locale}
          >
            {children}
          </ThemeLayout>
          <AutoAdsRefresh />
          <Suspense fallback={null}>
            <AnalyticsHandler />
          </Suspense>
          <GoogleAnalytics gaId="G-66T1KZEEJE" />
        </>
      </body>
    </html>
  );
}
