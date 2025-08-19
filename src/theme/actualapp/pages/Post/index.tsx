import { WPPost } from "wpjs-api";
import HeroPost from "../../components/HeroPost";
import styles from "./styles.module.css";
import PostMeta from "./PostMeta";
import Card from "../../components/Card";
import Author from "./Author";
import { Locales, t } from "@/app/i18n";
import { RenderHTML } from "wpnextjs-headless-next-base";

type PostProps = {
  post: WPPost;
  relatedPosts: WPPost[];
  locale: Locales;
};

const Post = ({ post, relatedPosts, locale }: PostProps) => {
  const { content, yoast_head_json } = post;
  return (
    <article className={styles.postWrapper}>
      <HeroPost post={post} />
      <div className={styles.post}>
        <section className={`postContent ${styles.postContent}`}>
          {yoast_head_json && <PostMeta data={yoast_head_json} />}
          <RenderHTML html={content.rendered} />
          {post._embedded?.author?.[0] && (
            <Author author={post._embedded.author[0]} locale={locale} />
          )}
        </section>
        <aside className={styles.postSidebar}>
          <h3 className={styles.relatedPostsTitle}>
            {t("common.relatedTitle", locale)}
          </h3>
          {relatedPosts?.map((relatedPost) => {
            return <Card key={relatedPost.id} post={relatedPost} relatedPost />;
          })}
        </aside>
      </div>
    </article>
  );
};

export default Post;
