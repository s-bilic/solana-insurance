import "./styles/globals.scss";
import ProviderAuth from "./components/provider/provider";
import styles from "./styles/layout.module.scss";
import React from "react";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { ConfigProvider } from "./lib/antd";
import ToastProvider from "./components/toastProvider/toastProvider";
import "react-toastify/dist/ReactToastify.css";
import Heading from "./components/heading/heading";

const Wallet = dynamic(() => import("./components/wallet/wallet"), {
  ssr: false,
});

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
        <ConfigProvider
          theme={{
            token: {},
          }}
        >
          <ToastProvider>
            <div className={styles.container}>
              <Wallet>
                <ProviderAuth>
                  <Heading />
                  {children}
                </ProviderAuth>
              </Wallet>
            </div>
          </ToastProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
