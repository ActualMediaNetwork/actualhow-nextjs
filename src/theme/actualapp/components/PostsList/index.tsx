import React, { Fragment } from "react";
import { WPPost } from "wpjs-api";
import Card from "../Card";
import styles from "./styles.module.css";

type Props = {
  posts: WPPost[];
  columns?: number;
  title?: string;
  description?: string;
  padding?: boolean;
  ads?: boolean;
};

const PostsList = ({
  posts,
  columns = 3,
  title,
  description,
  padding = false,
}: Props) => {
  return (
    <section
      className={styles.postsListWrapper}
      style={
        {
          "--columns": columns,
          padding: padding ? "1rem" : "",
        } as React.CSSProperties
      }
    >
      {title && (
        <h1
          className={styles.title}
          style={{ fontSize: "clamp(24px, 5vw, 40px)" }}
        >
          {title}
        </h1>
      )}
      {description && <p className={styles.description}>{description}</p>}
      <ul className={styles.postList}>
        {posts.map((post) => (
          <Fragment key={post.id}>
            <li className={styles.postItem}>
              <Card post={post} />
            </li>
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default PostsList;
