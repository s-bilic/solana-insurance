"use client";
import styles from "./styles/page.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import User from "./components/user/user";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className={styles.main}>
      <User address={publicKey?.toBase58()} />
    </main>
  );
}
