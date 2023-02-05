/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next'
import React, { useEffect } from 'react'
import styles from "@/styles/pages/Registration.module.scss";
import Router, { SingletonRouter, withRouter } from 'next/router'
import { useTranslate } from "@/hooks/useTranslate";
import LinkButton from '@/comp/LinkButton';
import Section from '@/comp/Section';


type Props = {
    router: SingletonRouter
}

const RegSuccess: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();

    const name = props.router.query.name;
    const email = props.router.query.email;

    useEffect(() => {
        if (!name || !email) {
            Router.push({
                pathname: "/"
            })
        }
    }, [])

    if (!name || !email) {
        return (
            <div className={styles.Registration}></div>
        );
    } else {
        return (
            <div className={styles.Registration}>
                <div className={styles.Registration__Success}>
                    <Section title={t("regSuccessTitle")}>
                        <div className={styles.Registration__Success__Content}>
                            <span>
                                {t("regSuccessWelcome")} {name}!
                            </span>
                            <span>
                                {t("regSuccessDesc1")} <span style={{"textDecoration": "underline"}}>{email}</span> {t("regSuccessDesc2")}
                            </span>
                            <span>
                                {t("regSuccessOutro")}<LinkButton isInternal={true} link={'/'} text={t("regSuccessButton")}></LinkButton>
                            </span>
                        </div>
                    </Section>
                </div>
            </div>
        );
    }
}

export default withRouter(RegSuccess)