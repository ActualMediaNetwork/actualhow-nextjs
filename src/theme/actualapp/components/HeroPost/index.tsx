import { WPPost } from "wpjs-api";
import CategoryTag from "@/theme/actualapp/components/Card/CategoryTag";
import styles from "./styles.module.css";
import { RenderHTML } from "wpnextjs-headless-next-base";

type HeroPostProps = { post: WPPost };

const HeroPost = ({ post }: HeroPostProps) => {
  const { title, featured_image, categories_data } = post;

  const titleContent = <RenderHTML html={title.rendered} />;

  const content = (
    <div className={styles.heroImageWrapper}>
      <img
        src={featured_image?.url ?? "/fallback.jpg"}
        alt={featured_image?.alt ?? "Default Image"}
        sizes="100vw"
        height="500"
        fetchPriority="high"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        decoding="async"
      />
      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <CategoryTag category={categories_data[0]} />
        <h1 className={styles.title}>{titleContent}</h1>
      </div>
    </div>
  );

  return content;
};

export default HeroPost;
