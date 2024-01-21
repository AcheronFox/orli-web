import { NextPage } from 'next'
import React from 'react'
import styles from "styles/components/footer/Footer.module.scss"
import FooterImageCarousel from './FooterImageCarousel'
import { RiQuestionLine, RiMailLine, RiInformationLine, RiFileList3Line, RiDatabase2Line, RiFacebookCircleLine, RiTelegramLine, RiDiscussLine, RiNotification2Line } from "react-icons/ri";
import useTranslate from '@/hooks/translate/useTranslate';

type Props = {}

const Footer: NextPage<Props> = (props: Props) => {
    const { lang } = useTranslate();
    
    return (
        <footer className={styles.Footer} id={"footer"}>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{lang.footerOrli}</h3>
                    </div>
                    <div className={styles.Footer__Item__Orli}>
                        {lang.footerOrliText}<br />
                        {lang.footerOrliText2}<br />
                        {lang.footerOrliText3}<br />
                        <span className={styles.Footer__Item__Orli__Copy}>
                            Copyright &copy; F Terminal 2023    
                        </span>
                    </div>
                </div>
            </div>
            {
                true &&
                <div className={styles.Footer__Item}>
                    <div>
                        <div className={styles.Footer__Item__Title}>
                            <h3>{lang.footerPartners}</h3>
                        </div>
                        <div className={styles.Footer__Item__Partners}>
                            <FooterImageCarousel lengthToSwitch={5} imgPaths={[{imgPath:"orli.png",link:"https://google.com"}, {imgPath:"test.jpg", link:"https://youtube.com"}, {imgPath:"test.png",link:"https://reddit.com"}]}></FooterImageCarousel>
                        </div>
                    </div>
                </div>
            }
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{lang.footerFind}</h3>
                    </div>
                    <div className={styles.Footer__Item__Find}>
                        {
                            /*
                            <SocialMediaButton link='https://www.facebook.com/events/2502630689892634/' icon={<RiFacebookCircleLine />} label={lang.footerFacebook}/>
                        <SocialMediaButton link='https://t.me/orliforstivalHU' icon={<RiTelegramLine />} icon2={<RiDiscussLine />} label={lang.footerTelegramChat}/>
                        <SocialMediaButton link='https://t.me/orliforsztival' icon={<RiTelegramLine />} icon2={<RiNotification2Line />} label={lang.footerTelegramAnnounce}/>
                            */
                        }
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Break}></div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{lang.footerHelp}</h3>
                    </div>
                    <div className={styles.Footer__Item__Help}>
                        {
                            /*
                                                    <LinkButton text={lang.footerFaq} link={"/faq"} icon={<RiQuestionLine />} isInternal={true}></LinkButton>
                        <LinkButton text={lang.footerContact} link={"/contact"} icon={<RiMailLine />} isInternal={true}></LinkButton>

                            */
                        }
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{lang.footerLegal}</h3>
                    </div>
                    <div className={styles.Footer__Item__Legal}>
                        {
                            /*
                        <LinkButton text={lang.footerRules} link={"/legal/rules"} icon={<RiFileList3Line />} isInternal={true}></LinkButton>
                        <LinkButton text={lang.footerData} link={"/legal/data"} icon={<RiDatabase2Line />} isInternal={true}></LinkButton>

                            */
                        }
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer