import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/PrimaryButton.module.scss";
import Link from "next/link";

type Props = {
  text: string | React.ReactNode;
  onClick?: Function;
  type?: string;
  link?: string;
  disabled?: boolean;
};

const PrimaryButton: NextPage<Props> = ({
  text,
  onClick,
  type,
  link,
  disabled
}: Props) => {

  if (link) {
    return (
      <Link onClick={() => onClick? onClick() : {}} href={link} target="_blank"
        className={`
        ${styles.Button}
        ${type == "left" && styles.Button_left}
        ${type == "center" && styles.Button_center}
        ${type == "right" && styles.Button_right}
        ${disabled? styles.Button__Disabled : ''} 
        `}>
          <span className={`${styles.Button__Text} ${disabled? styles.Button__Text__Disabled : ''} `}>{text}</span>
      </Link>
    );
  } else {
    return (
      <div onClick={() => onClick? onClick() : {}}
        className={`
        ${styles.Button}
        ${type == "left" && styles.Button_left}
        ${type == "center" && styles.Button_center}
        ${type == "right" && styles.Button_right}
        ${disabled? styles.Button__Disabled : ''} 
        `}>
          <span className={`${styles.Button__Text} ${disabled? styles.Button__Text__Disabled : ''} `}>{text}</span>
      </div>
    );
  }
};

export default PrimaryButton;