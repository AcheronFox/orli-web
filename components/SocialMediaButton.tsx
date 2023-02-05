import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/SocialMediaButton.module.scss";
import Link from "next/link";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

type Props = {
  link: string;
  icon: React.ReactNode;
  icon2?: React.ReactNode;
  label?: string;
};

const SocialMediaButton: NextPage<Props> = ({
  link,
  icon,
  icon2,
  label,
}: Props) => {


  return (
    <Tippy className={styles.Tooltip} content={label}>
      <Link id="social" href={link} className={styles.Button} target={"_blank"} rel={"noopener noreferrer"}>
        <span className={`${styles.Button__Icon} ${icon2? styles.Button__Icon_1 : ''}`}>{icon}</span>
        <span className={`${styles.Button__Icon_2} ${styles.Button__Icon}`}>{icon2}</span>
      </Link>
    </Tippy>
  );
};

export default SocialMediaButton;