import Link from "next/link";
import React from "react";
import styles from "./styles.module.css";
import { convertAPIUrlByFrontDomain } from "wpnextjs-headless-next-base";

type CategoryTagProps = { category: { url: string; name: string } };

const CategoryTag = ({ category }: CategoryTagProps) => {
  return (
    <>
      {category && (
        <div className={styles.categoryWrapper}>
          <Link
            href={convertAPIUrlByFrontDomain(
              category.url,
              process.env.FRONT_DOMAIN ?? ""
            )}
          >
            <div className={styles.category}>{category.name}</div>
          </Link>
        </div>
      )}
    </>
  );
};

export default CategoryTag;
