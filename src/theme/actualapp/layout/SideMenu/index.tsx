"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { ChevronsLeft } from "lucide-react";

type SideMenuProps = { children: React.ReactNode };

const SideMenu = ({ children }: SideMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  return (
    <aside data-open={isMenuOpen} className={styles.menuWrapper}>
      {children}
      <div className={styles.menuToggle}>
        <ChevronsLeft
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            cursor: "pointer",
            transform: isMenuOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
    </aside>
  );
};

export default SideMenu;
