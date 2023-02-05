import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/IconCard.module.scss"
import Link from "next/link";

type Props = {
    title: string;
    icon: React.ReactNode;
    link: string;
};

const IconCard: NextPage<Props> = (props: Props) => {
    return (
        <Link href={props.link} className={styles.IconCard}>
            <div className={styles.IconCard__Icon}>
                {props.icon}
            </div>
            <div className={styles.IconCard__Title}>
                <h2>
                    {props.title}
                </h2>
            </div>
        </Link>
    );
};

export default IconCard;