import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/LinkButton.module.scss";
import { RiExternalLinkLine } from "react-icons/ri";
import Link from "next/link";

type Props = {
  text: string;
  link: string;
  isInternal?: boolean;
  icon?: React.ReactNode;
};

const LinkButton: NextPage<Props> = ({
  text,
  link,
  isInternal = false,
  icon
}: Props) => {

  if (isInternal) {
    return (
      <Link href={link} className={styles.Button}>
        {icon && <span className={styles.Button__Icon}>{icon}</span>}
        <span className={styles.Button__Text}>{text}</span>
        <span className={styles.Button__ExternalIcon}><RiExternalLinkLine /></span>
      </Link>
    );
  }
  else {
    return (
      <a href={link} className={styles.Button} target={"_blank"} rel={"noopener noreferrer"}>
        {icon && <span className={styles.Button__Icon}>{icon}</span>}
        <span className={styles.Button__Text}>{text}</span>
        <span className={styles.Button__ExternalIcon}><RiExternalLinkLine /></span>
      </a>
    );
  }
};

export default LinkButton;