import { NextPage } from 'next'
import React from 'react'
import styles from "styles/components/footer/Footer.module.scss"
import FooterImageCarousel from './FooterImageCarousel'
import { useTranslate } from "@/hooks/useTranslate";
import LinkButton from './LinkButton'
import SocialMediaButton from './SocialMediaButton';

import { RiQuestionLine, RiMailLine, RiInformationLine, RiFileList3Line, RiDatabase2Line, RiFacebookCircleLine, RiTelegramLine, RiDiscussLine, RiNotification2Line } from "react-icons/ri";

type Props = {}

const Footer: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();
    
    return (
        <footer className={styles.Footer}>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerOrli")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Orli}>
                        {t("footerOrliText")}<br />
                        {t("footerOrliText2")}<br />
                        {t("footerOrliText3")}<br />
                        <span className={styles.Footer__Item__Orli__Copy}>
                            Copyright &copy;     
                        </span>
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
                        <SocialMediaButton link='#' icon={<RiFacebookCircleLine />} label={t("footerFacebook")}/>
                        <SocialMediaButton link='https://t.me/orliforstivalHU' icon={<RiTelegramLine />} icon2={<RiDiscussLine />} label={t("footerTelegramChat")}/>
                        <SocialMediaButton link='https://t.me/orliforsztival' icon={<RiTelegramLine />} icon2={<RiNotification2Line />} label={t("footerTelegramAnnounce")}/>
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Break}></div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerHelp")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Help}>
                        <LinkButton text={t("footerFaq")} link={"/faq"} icon={<RiQuestionLine />} isInternal={true}></LinkButton>
                        <LinkButton text={t("footerContact")} link={"/test"} icon={<RiMailLine />} isInternal={true}></LinkButton>
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{t("footerLegal")}</h3>
                    </div>
                    <div className={styles.Footer__Item__Legal}>
                        <LinkButton text={t("footerRules")} link={"/legal/rules"} icon={<RiFileList3Line />} isInternal={true}></LinkButton>
                        <LinkButton text={t("footerData")} link={"/legal/data"} icon={<RiDatabase2Line />} isInternal={true}></LinkButton>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer