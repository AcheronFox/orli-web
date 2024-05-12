import { NextPage } from "next";
import Image from "next/image";
import React from "react";
import styles from "@/styles/components/utils/Picture.module.scss"

type Props = {
  alt: string;
  defaultSrc: string;
  sizes: string
  className?: string;
};

const Picture: NextPage<Props> = (props: Props) => {

  return (
    <Image
      className={`${props.className? props.className : ''} ${styles.Picture}`}
      src={process.env.NODE_ENV=="development"? "/" + props.defaultSrc : props.defaultSrc}
      alt={props.alt}
      sizes={props.sizes}
      width={0}
      height={0}
    />
  );
};

export default Picture;