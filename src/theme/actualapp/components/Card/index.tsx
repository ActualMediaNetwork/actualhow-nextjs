import Link from "next/link";
import { WPPost } from "wpjs-api";
import styles from "./styles.module.css";
import {
  convertAPIUrlByFrontDomain,
  RenderHTML,
} from "wpnextjs-headless-next-base";

type CardProps = {
  post: WPPost;
  showCategory?: boolean;
  relatedPost?: boolean;
};

const Card = ({
  post,
  showCategory = false,
  relatedPost = false,
}: CardProps) => {
  const { link, featured_image, title } = post;

  return (
    <Link
      href={convertAPIUrlByFrontDomain(
        link,
        process.env.NEXT_PUBLIC_FRONT_DOMAIN ?? ""
      )}
      aria-label={featured_image?.alt ?? "Imagen destacada"}
      className={styles.cardLink}
    >
      <article
        className={styles.cardWrapper}
        style={{
          justifyContent: showCategory ? "space-between" : "flex-end",
        }}
      >
        <img
          src={featured_image?.url ?? "default"}
          alt={featured_image?.alt ?? "Imagen destacada"}
          sizes="100vw"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          loading="lazy"
          decoding="async"
          className={styles.cardBackgroundImage}
        />

        <div className={styles.cardOverlay} />

        {/* {showCategory && <CategoryTag category={categories_data[0]} />} */}
        {relatedPost ? (
          <h4 className={styles.titleCard}>
            <RenderHTML html={title?.rendered} />
          </h4>
        ) : (
          <h2 className={styles.titleCard}>
            <RenderHTML html={title?.rendered} />
          </h2>
        )}
      </article>
    </Link>
  );
};

export default Card;
