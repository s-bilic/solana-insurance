"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./user.module.scss";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  address?: string;
}

const User = ({ className }: IProps) => {
  const { publicKey } = useWallet();
  const { data: session } = useSession();
  const classes = cx(
    {
      user: true,
    },
    className
  );

  return (
    <div className={classes}>
      <div>
        <span>
          {session
            ? "Welcome to your personal overview"
            : "Leveraging Solana for claims"}
        </span>
      </div>
      {session && (
        <div>
          <h4 className={styles.address}>{publicKey?.toBase58()}</h4>
        </div>
      )}
    </div>
  );
};

export default User;
