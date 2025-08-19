import { WPPage } from "wpjs-api";
import style from "./styles.module.css";
import { RenderHTML } from "wpnextjs-headless-next-base";

type Props = { page: WPPage };

const Page = ({ page }: Props) => {
  return (
    <article className={style.pageWrapper}>
      <h1 className={style.pageTitle}>
        <RenderHTML html={page.title.rendered} />
      </h1>
      <RenderHTML html={page.content.rendered} />
    </article>
  );
};

export default Page;
