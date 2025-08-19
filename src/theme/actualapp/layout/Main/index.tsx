import styles from "./styles.module.css";

type MainProps = { children: React.ReactNode };

const Main = ({ children }: MainProps) => {
  return <main className={styles.mainWrapper}>{children}</main>;
};

export default Main;
