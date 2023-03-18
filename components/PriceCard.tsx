import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/PriceCard.module.scss"
import { useTranslate } from "@/hooks/useTranslate";

type Props = {
    title: string;
    description?: string | React.ReactNode;
    price: string | number;
    euro?: string | number;
    button?: React.ReactNode;
    customClass?: string;
};

const PriceCard: NextPage<Props> = (props: Props) => {
    const { locale } = useTranslate();

    return (
        <div className={`${styles.PriceCard} ${props.customClass}`}>
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
            {props.euro && locale == 'en' && <div className={styles.PriceCard__Euro}><h3>&euro; ~{props.euro}</h3></div>}
            {
                props.button &&
                <div className={styles.PriceCard__Button}>
                    {props.button}
                </div>
            }
        </div>
    );
};

export default PriceCard;