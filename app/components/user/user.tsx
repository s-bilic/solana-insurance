"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./user.module.scss";
import { ClipboardOutline } from "react-ionicons";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  address?: string;
}

const User = ({ className, address }: IProps) => {
  const classes = cx(
    {
      user: true,
    },
    className
  );

  return (
    <div className={classes}>
      <div>
        <p>Welcome to your personal overview</p>
      </div>
      <div>
        <h4 className={styles.address}>{address}</h4>
      </div>
    </div>
  );
};

export default User;
