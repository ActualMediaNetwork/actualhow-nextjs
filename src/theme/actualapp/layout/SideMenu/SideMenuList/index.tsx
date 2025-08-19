import { WPMenuItem } from "wpjs-api";
import Logo from "@/theme/actualapp/components/Logo";
import SideMenuItem from "./SideMenuItem";
import styles from "./styles.module.css";

type SideMenuContentProps = { headerMenu: WPMenuItem[]; locale: string };

const SideMenuContent = ({ headerMenu, locale }: SideMenuContentProps) => {
  return (
    <div className={styles.menuContentWrapper}>
      <Logo className="sideMenuLogo" locale={locale} />
      <nav>
        <ul className={styles.menuList}>
          {headerMenu.map((item) => {
            return <SideMenuItem key={item.id} item={item} />;
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideMenuContent;
