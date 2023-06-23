"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./heading.module.scss";
import User from "../user/user";
import SignIn from "../signIn/signIn";
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
        <SignIn />
      </div>
    </div>
  );
};

export default Heading;
