"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./styles.module.css";
import { WPMenuItem } from "wpjs-api";
import Logo from "../Logo";
import { usePathname } from "next/navigation";
import {
  convertAPIUrlByFrontDomain,
  RenderHTML,
} from "wpnextjs-headless-next-base";

type MobileNavProps = {
  menu: WPMenuItem[];
  locale: string;
};

const MobileNav = ({ menu, locale }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <nav className={styles.mobileNav}>
      <div className={styles.navBar}>
        <button
          className={styles.menuToggle}
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <Menu size={50} />
        </button>
        <div className={styles.logo}>
          <Logo locale={locale} />
        </div>
        <div className={styles.right}></div>
      </div>

      {open && (
        <div
          className={`${styles.fullScreenMenu} ${
            open ? styles.open : styles.closed
          }`}
        >
          <button
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X />
          </button>
          <ul className={styles.mobileMenu}>
            {menu.map((item) => {
              return (
                <li key={item.id}>
                  <Link
                    href={convertAPIUrlByFrontDomain(
                      item.url,
                      process.env.NEXT_PUBLIC_FRONT_DOMAIN ?? ""
                    )}
                  >
                    <RenderHTML html={item.title.rendered} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MobileNav;
