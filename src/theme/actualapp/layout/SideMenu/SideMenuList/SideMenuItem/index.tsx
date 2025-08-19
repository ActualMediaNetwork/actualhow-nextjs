import Link from "next/link";
import React from "react";
import { WPMenuItem } from "wpjs-api";
import styles from "./styles.module.css";
import * as LucideIcons from "lucide-react";
import {
  convertAPIUrlByFrontDomain,
  RenderHTML,
} from "wpnextjs-headless-next-base";

type SideMenuItemProps = {
  item: WPMenuItem;
};

const SideMenuItem = ({ item }: SideMenuItemProps) => {
  const { id, title, url, classes } = item;
  const iconKey = classes?.[0] || "HelpCircle";

  const Icon =
    (LucideIcons[iconKey as keyof typeof LucideIcons] as React.ElementType) ||
    LucideIcons.HelpCircle;

  return (
    <li key={id} className={styles.liWrapper}>
      <Link
        href={convertAPIUrlByFrontDomain(url, process.env.FRONT_DOMAIN ?? "")}
        className={styles.menuItem}
      >
        <div className={styles.icon}>
          <Icon size={18} strokeWidth={1.8} className={styles.menuIcon} />
        </div>
        <div className={styles.menuLink}>
          <RenderHTML html={title.rendered} />
        </div>
      </Link>
    </li>
  );
};

export default SideMenuItem;
