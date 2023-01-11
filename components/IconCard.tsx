import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/IconCard.module.scss"

type Props = {
    title: string;
    icon: React.ReactNode;
    link: string;
};

const IconCard: NextPage<Props> = (props: Props) => {
    return (
        <a href={props.link} className={styles.IconCard}>
            <div className={styles.IconCard__Icon}>
                {props.icon}
            </div>
            <div className={styles.IconCard__Title}>
                <h2>
                    {props.title}
                </h2>
            </div>
        </a>
    );
};

export default IconCard;