"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./user.module.css";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  address?: string;
}

const User = ({ className, address }: IProps) => {
  const classes = cx(
    {
      actionCard: true,
    },
    className
  );

  return (
    <div className={classes}>
      <h3>Hello {address}</h3>
    </div>
  );
};

export default User;
