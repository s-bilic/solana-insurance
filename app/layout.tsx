import "./globals.css";
import styles from "./styles/layout.module.css";
import React from "react";
import { Inter } from "next/font/google";
import Wallet from "./components/wallet/wallet";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Insurance on Solana (web3)",
  description: "Insurance application using Solana (web3)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.container}>
          <Wallet>{children}</Wallet>
        </div>
      </body>
    </html>
  );
}
