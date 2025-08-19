import React from "react";
import { WPPost } from "wpjs-api";
import PostsList from "../../components/PostsList";
import HeroHome from "../../components/HeroHome";
import styles from "./styles.module.css";

type HomeProps = {
  posts: WPPost[];
};

const Home = ({ posts }: HomeProps) => {
  const heroes = posts.slice(0, 2);
  const recent = posts.slice(2, 6);
  const rest = posts.slice(6);
  return (
    <div className={styles.mainWrapper}>
      {heroes && <HeroHome posts={heroes} />}
      {recent.length > 0 && <PostsList posts={recent} columns={4} />}
      {rest.length > 0 && <PostsList posts={rest} columns={3} />}
    </div>
  );
};

export default Home;
