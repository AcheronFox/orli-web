import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/InfoCard.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import PrimaryButton from "./PrimaryButton";

type Props = {
    title: string;
    description?: string | React.ReactNode
    time?: string[] | React.ReactNode;
    text?: string | React.ReactNode;
    children?: React.ReactNode;
    buttonAction?: Function;
    link?: string;
};

const InfoCard: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();

    return (
        <section className={styles.InfoCard}>
            <h2 className={styles.InfoCard__Title}>{props.title}</h2>
            <div className={styles.InfoCard__Content}>
                <h4 className={styles.InfoCard__Content__Description}>{props.description}</h4>
                {props.time && <span className={styles.InfoCard__Content__Time}>
                    <div>{t("infoCardTime")}</div>
                    <div>{props.time}</div>
                </span>}
                <p className={styles.InfoCard__Content__Text}>{props.text}</p>
            </div>
            <div className={styles.InfoCard__Button}>
                <PrimaryButton text={t("infoCardButton")} onClick={props.buttonAction} link={props.link}></PrimaryButton>
            </div>
            {props.children && <div className={styles.InfoCard__Border}>
                {props.children}
            </div>}
        </section>
    );
};

export default InfoCard;