"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./claim.module.scss";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
  content?: string;
  button?: string;
}

const Claim = ({ className, title, content, button }: IProps) => {
  const classes = cx(
    {
      claim: true,
    },
    className
  );

  return (
    <div className={classes}>
      <div>
        {title && <h6>{title}</h6>}
        {content && <p className={styles.content}>{content}</p>}
      </div>
      <div className={styles.button}>
        <button>Claim Payment</button>
      </div>
    </div>
  );
};

export default Claim;
