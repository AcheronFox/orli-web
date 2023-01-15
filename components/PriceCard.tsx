import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/PriceCard.module.scss"

type Props = {
    title: string;
    description?: string | React.ReactNode;
    price: string;
    euro?: string;
};

const PriceCard: NextPage<Props> = (props: Props) => {
    return (
        <div className={styles.PriceCard}>
            <div className={styles.PriceCard__Title}>
                <h2>
                    {props.title}
                </h2>
            </div>
            {props.description &&
            <div className={styles.PriceCard__Description}>
                {props.description}
            </div>}
            <div className={styles.PriceCard__Price}><h3>{props.price} HUF</h3></div>
            {props.euro && <div className={styles.PriceCard__Euro}><h3>&euro; ~{props.euro}</h3></div>}
        </div>
    );
};

export default PriceCard;