import Link from "next/link";
import { WPMenuItem } from "wpjs-api";
import Logo from "../../components/Logo";
import styles from "./styles.module.css";
import {
  convertAPIUrlByFrontDomain,
  RenderHTML,
} from "wpnextjs-headless-next-base";

type FooterProps = { footerMenu: WPMenuItem[]; locale: string };

const Footer = ({ footerMenu, locale }: FooterProps) => {
  return (
    <footer className={styles.footerWrapper}>
      <Logo mobile locale={locale} />
      <ul className={styles.footerMenu}>
        {footerMenu.map((menuItem) => {
          const { id, title, url } = menuItem;
          return (
            <li key={id} className={styles.footerMenuItem}>
              <Link
                href={convertAPIUrlByFrontDomain(
                  url,
                  process.env.FRONT_DOMAIN ?? ""
                )}
                style={{ padding: "1rem" }}
              >
                <RenderHTML html={title.rendered} />
              </Link>
            </li>
          );
        })}
      </ul>
    </footer>
  );
};

export default Footer;
