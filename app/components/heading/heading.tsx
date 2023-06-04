"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./heading.module.scss";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import User from "../user/user";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
}

const Heading = ({ className }: IProps) => {
  const classes = cx(
    {
      heading: true,
    },
    className
  );

  return (
    <div className={classes}>
      <div className={styles.wrapper}>
        <User />
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Heading;
