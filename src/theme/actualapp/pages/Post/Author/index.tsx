import { WPAuthorInfo } from "wpjs-api";
import styles from "./styles.module.css";
import { Locales, t } from "@/app/i18n";
type Props = { author: WPAuthorInfo; locale: Locales };

const Author = ({ author, locale }: Props) => {
  const authorData = author;
  if (!authorData) {
    return null;
  }
  const { avatar_urls, name, description, slug } = authorData;
  return (
    <div aria-label={`${t("common.aboutAuthor", locale)} ${name}`}>
      <div className={styles.authorInfo}>
        <img
          className={styles.authorAvatar}
          src={avatar_urls?.["96"]}
          alt={name}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.authorDetails}>
          <div
            style={{
              color: "#333",
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
            }}
          >
            <span className={styles.authorName}>{name}</span>
          </div>
          <p className={styles.authorBio}>
            {t(`common.bio${slug}`, locale) ?? description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Author;
