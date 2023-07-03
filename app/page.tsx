import styles from "./styles/page.module.scss";
import Heading from "./components/heading/heading";
import Tabs from "./components/tabs/tabs";
export default async function Home() {
  return (
    <main className={styles.main}>
      <Heading />
      <Tabs />
    </main>
  );
}
