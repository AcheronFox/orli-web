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


    return (
        <Link href={link} className={styles.Button} target={isInternal? "_parent" : "_blank"} rel={isInternal? "" : "noopener noreferrer"}>
            {icon && <span className={styles.Button__Icon}>{icon}</span>}
            <span className={styles.Button__Text}>{text}</span>
            <span className={styles.Button__ExternalIcon}><RiExternalLinkLine /></span>
        </Link>
    );
};

export default LinkButton;