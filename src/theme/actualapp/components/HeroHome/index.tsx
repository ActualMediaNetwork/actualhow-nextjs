import Link from "next/link";
import { WPPost } from "wpjs-api";
import styles from "./styles.module.css";
import {
  convertAPIUrlByFrontDomain,
  RenderHTML,
} from "wpnextjs-headless-next-base";

type HeroHomeProps = { posts: WPPost[] };

const HeroHome = ({ posts }: HeroHomeProps) => {
  return (
    <section className={styles.heroHomeWrapper}>
      {posts.map((post) => {
        const { title, link, featured_image } = post;
        const titleContent = <RenderHTML html={title.rendered} />;
        const content = (
          <article className={styles.heroImageWrapper}>
            <img
              src={featured_image?.url ?? "/fallback.jpg"}
              alt={featured_image?.alt ?? "Default Image"}
              sizes="100vw"
              height="500"
              fetchPriority="high"
              style={{
                objectFit: "cover",
                width: "100%",
                position: "absolute",
                height: "100%",
              }}
              decoding="async"
            />
            <div className={styles.heroOverlay} />

            <div className={styles.heroContent}>
              <h2 className={styles.title}>{titleContent}</h2>
            </div>
          </article>
        );

        return (
          <Link
            href={convertAPIUrlByFrontDomain(
              link,
              process.env.NEXT_PUBLIC_FRONT_DOMAIN ?? ""
            )}
            className={styles.heroLink}
            aria-label={title.rendered.replace(/<[^>]+>/g, "")}
            key={post.id}
          >
            {content}
          </Link>
        );
      })}
    </section>
  );
};

export default HeroHome;
