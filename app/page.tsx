"use client";
import styles from "./styles/page.module.scss";
import { useWallet } from "@solana/wallet-adapter-react";
import User from "./components/user/user";
import Claims from "./components/claims/claims";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const { publicKey } = useWallet();

  const claimsData = [
    {
      title: "Defect computer",
      content:
        "After thourough examination we had to deny this claim, since it appears you tried to clean your computer",
    },
    {
      title: "Stolen Bicycle",
      content:
        "Your before and after pictures are clear evidence that your bicycle has been stolen",
    },
    {
      title: "Stolen Bicycle",
      content:
        "Your before and after pictures are clear evidence that your bicycle has been stolen",
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.userWrapper}>
        <User address={publicKey?.toBase58()} />
        <WalletMultiButton />
      </div>
      <div className={styles.claimsWrapper}>
        <Claims title={"Open claims"} items={claimsData} />
      </div>
    </main>
  );
}
