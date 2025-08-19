import SideMenu from "./SideMenu";
import SideMenuContent from "./SideMenu/SideMenuList";
import Main from "./Main";
import Footer from "./Footer";
import styles from "./styles.module.css";
import { WPMenuItem } from "wpjs-api";
import MobileNav from "../components/MobileNav";

type ThemeLayoutProps = {
  headerMenu: WPMenuItem[];
  footerMenu: WPMenuItem[];
  children: React.ReactNode;
  locale: string;
};

const ThemeLayout = ({
  headerMenu,
  footerMenu,
  children,
  locale,
}: ThemeLayoutProps) => {
  return (
    <>
      <MobileNav menu={headerMenu} locale={locale} />
      <div className={styles.mainWrapper}>
        <SideMenu>
          <SideMenuContent headerMenu={headerMenu} locale={locale} />
        </SideMenu>
        <Main>{children}</Main>
      </div>
      <Footer footerMenu={footerMenu} locale={locale} />
    </>
  );
};

export default ThemeLayout;
