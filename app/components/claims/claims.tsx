"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./claims.module.scss";
import Claim from "../claim/claim";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
  items?: any;
}

const Claims = ({ className, title, items }: IProps) => {
  const classes = cx(
    {
      claims: true,
    },
    className
  );

  return (
    <div className={classes}>
      {title && <p>{title}</p>}
      <div className={styles.items}>
        {items?.map((item, index) => (
          <Claim key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Claims;
