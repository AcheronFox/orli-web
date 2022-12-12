import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import styles from "@/styles/components/navbar/NavItems.module.scss";
import { AxiosResponse } from "axios";

type Props = {
  children: React.ReactNode;
  link: string;
  CustomStyle?: string;
  onClick?: ((e: any) => (void | undefined)) | (() => Promise<AxiosResponse<any, any>>) | (()=> Promise<void>);
  shouldOverwrite?: boolean;
  icon?: JSX.Element;
};

const NavItem: NextPage<Props> = ({
  children,
  link,
  CustomStyle,
  onClick,
  shouldOverwrite = true,
  icon,
}: Props) => {

  return (
    <Link href={link} className={shouldOverwrite? CustomStyle ?? (styles.Item) : `${(styles.Item)} ${CustomStyle}`} onClick={onClick}>
      <div className={styles.ContentWrapper}>
        {icon && <div className={styles.IconWrapper}>{icon}</div>}
        <span className={styles.ItemName}>{children}</span>
      </div>
    </Link>
  );
};

export default NavItem;