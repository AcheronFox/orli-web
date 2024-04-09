/* eslint-disable react-hooks/exhaustive-deps */
/*import { NextPage } from 'next'
import React, { useEffect } from 'react'
import styles from "@/styles/pages/Registration.module.scss";
import Router, { SingletonRouter, withRouter } from 'next/router'
import CustomHead from '@/comp/utils/CustomHead';
import useTranslate from '@/hooks/translate/useTranslate';
import Button from '@/comp/button/Button';
import TextCard from '@/comp/TextCard';


type Props = {
    router: SingletonRouter
}

const RegSuccess: NextPage<Props> = (props: Props) => {
    const { lang } = useTranslate();

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
            <> 
                <CustomHead title={lang.regSuccessTitle} />
                <div className={styles.Registration__Background} />
                <div className={`${styles.Registration} ${styles.Registration__Success}`}>
                    <div className={styles.Registration__Center}>
                        <TextCard
                            title={lang.regSuccessTitle}
                            shadowEnabled
                            variant='filled'
                        >
                            <div className={styles.Registration__Success__Content}>
                                <span>
                                    {`${lang.regSuccessWelcome} ${name}!`}
                                </span>
                                <br/>
                                <span>
                                    {lang.regSuccessDesc1} <span style={{"textDecoration": "underline"}}>{email}</span> {lang.regSuccessDesc2}
                                </span>
                                <span className={styles.Registration__Success__Row}>
                                    {lang.regSuccessOutro}
                                    <span className={styles.Registration__Success__Button}>
                                        <Button
                                            link={'/'}
                                            variant='text'
                                        >
                                            {lang.regSuccessButton}
                                        </Button>
                                    </span>
                                </span>
                            </div>
                        </TextCard>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(RegSuccess)
*/

import TempWIP from "@/comp/TempWIP";
import { NextPage } from "next";

type Props = {}

const RegSuccess: NextPage<Props> = (props: Props) => {

  return (
    <TempWIP/>
  );
}
export default RegSuccess