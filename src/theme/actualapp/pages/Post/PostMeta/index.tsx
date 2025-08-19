import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { WPYoastHeadJson } from "wpjs-api";
import styles from "./styles.module.css";

type Props = { data: WPYoastHeadJson };

const PostMeta = ({ data }: Props) => {
  return (
    <div className={styles.postMeta}>
      <div className={styles.postMetaItem}>
        <Calendar />
        {data.article_modified_time
          ? format(data.article_modified_time, "dd/MM/yyyy")
          : format(data.article_published_time, "dd/MM/yyyy")}
      </div>

      <div className={styles.postMetaItem}>
        <User />
        {data.author}
      </div>
    </div>
  );
};

export default PostMeta;
