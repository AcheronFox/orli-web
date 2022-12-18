import { NextPage } from 'next'
import React from 'react'
import styles from "styles/components/footer/Footer.module.scss"
import FooterImageCarousel from './FooterImageCarousel'
import { useTranslate } from "@/hooks/useTranslate";
import LinkButton from './LinkButton'

import { RiQuestionLine } from "react-icons/ri";
import { RiMailLine } from "react-icons/ri";
import { RiInformationLine } from "react-icons/ri";
import { RiFileList3Line } from "react-icons/ri";
import { RiDatabase2Line } from "react-icons/ri";

type Props = {}

const Footer: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();
    
    return (
        <footer id="footer" className={styles.Footer}>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerOrli")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Orli}>
                        {t("footerOrliText")}
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerPartners")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Partners}>
                        <FooterImageCarousel lengthToSwitch={5} imgPaths={[{imgPath:"orli.png",link:"https://google.com"}, {imgPath:"test.jpg", link:"https://youtube.com"}, {imgPath:"test.png",link:"https://reddit.com"}]}></FooterImageCarousel>
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerFind")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Find}>
                        Hi
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerHelp")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Help}>
                        <LinkButton text={t("footerFaq")} link={"/faq"} icon={<RiQuestionLine />} isInternal={true}></LinkButton>
                        <LinkButton text={t("footerContact")} link={"test"} icon={<RiMailLine />} isInternal={true}></LinkButton>
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerLegal")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Legal}>
                        <LinkButton text={t("footerTos")} link={"/info#tos"} icon={<RiInformationLine />} isInternal={true}></LinkButton>
                        <LinkButton text={t("footerRules")} link={"/info#rules"} icon={<RiFileList3Line />} isInternal={true}></LinkButton>
                        <LinkButton text={t("footerData")} link={"/info#data"} icon={<RiDatabase2Line />} isInternal={true}></LinkButton>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer