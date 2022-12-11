import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import styles from "@/styles/components/navbar/NavItems.module.scss";
import { AxiosResponse } from "axios";

type Props = {
  children: React.ReactNode;
  link: string;
  CustomStyle?: string;
  onClick?: ((e: any) => (void | undefined)) | (() => Promise<AxiosResponse<any, any>>) | (()=> Promise<void>),
  shouldOverwrite?: boolean
};

const NavItem: NextPage<Props> = ({
  children,
  link,
  CustomStyle,
  onClick,
  shouldOverwrite = true,
}: Props) => {

  return (
    <Link href={link} className={shouldOverwrite? CustomStyle ?? (styles.Item) : `${(styles.Item)} ${CustomStyle}`} onClick={onClick}>
      <span className={styles.ItemName}>{children}</span>
    </Link>
  );
};

export default NavItem;