import { WPAuthorInfo } from "wpjs-api";
import styles from "./styles.module.css";
import { Link, Linkedin } from "lucide-react";
import { Locales, t } from "@/app/i18n";
type Props = { author: WPAuthorInfo; locale: Locales };

const Author = ({ author, locale }: Props) => {
  const authorData = author;
  if (!authorData) {
    return null;
  }
  const { avatar_urls, name, description } = authorData;
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
            {name === "Edu Diaz" ? (
              <a
                style={{ color: "#333" }}
                aria-label={t("common.linkedinEdu", locale)}
                href="https://www.linkedin.com/in/eduard-diaz-capallera-2a124b153/"
              >
                <Linkedin size={18} aria-hidden="true" focusable="false" />
              </a>
            ) : (
              name === "Alberto Guerrero" && (
                <a
                  style={{ color: "#333" }}
                  aria-label={t("common.linkTreeAlberto", locale)}
                  href="https://linktr.ee/albertogarnau"
                >
                  <Link size={18} aria-hidden="true" focusable="false" />
                </a>
              )
            )}
          </div>
          <p className={styles.authorBio}>
            {name === "Edu Diaz"
              ? t("common.bioEdu", locale)
              : name === "Alberto Guerrero"
              ? t("common.bioAlberto", locale)
              : description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Author;
