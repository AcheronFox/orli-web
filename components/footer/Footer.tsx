import { NextPage } from 'next'
import React from 'react'
import styles from "styles/components/footer/Footer.module.scss"
import FooterImageCarousel from './FooterImageCarousel'
import { RiQuestionLine, RiMailLine, RiFileList3Line, RiDatabase2Line, RiTelegramLine, RiTelegramFill, RiExternalLinkLine, RiTwitterXFill, RiFacebookFill } from "react-icons/ri";
import useTranslate from '@/hooks/translate/useTranslate';
import IconButton from '../button/IconButton';
import ButtonGroup from '../button/ButtonGroup';
import Button from '../button/Button';

type Props = {}

const Footer: NextPage<Props> = (props: Props) => {
    const { lang, currLang } = useTranslate();

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
                            Copyright &copy; F Terminal 2024    
                        </span>
                    </div>
                </div>
            </div>
            {
                false &&
                <div className={styles.Footer__Item}>
                    <div>
                        <div className={styles.Footer__Item__Title}>
                            <h3>{lang.footerPartners}</h3>
                        </div>
                        <div className={styles.Footer__Item__Partners}>
                            <FooterImageCarousel
                                lengthToSwitch={5}
                                imgPaths={[
                                    {imgPath:"orli.png", link:"https://google.com", alt: "partner1", sizes: "(max-width: 125em) 22rem, (max-width: 187.5em) 25rem, 16rem"},
                                    {imgPath:"test.jpg", link:"https://youtube.com", alt: "partner2", sizes: "(max-width: 125em) 22rem, (max-width: 187.5em) 25rem, 16rem"},
                                    {imgPath:"test.png", link:"https://reddit.com", alt: "partner3", sizes: "(max-width: 125em) 22rem, (max-width: 187.5em) 25rem, 16rem"}]
                                }
                            />
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
                        <IconButton
                            size='large'
                            target='_blank'
                            link='https://www.facebook.com/events/893079725907753'
                            tooltip={lang.footerFacebook}
                            tooltipColor='black'
                        >
                            <RiFacebookFill />
                        </IconButton>
                        <IconButton
                            size='large'
                            target='_blank'
                            link={
                                (currLang=='hu')
                                ? 'https://t.me/orliforstivalHU'
                                : 'https://t.me/orliforstivalEN'
                            }
                            tooltip={lang.footerTelegramChat}
                            tooltipColor='black'
                        >
                            <RiTelegramFill />
                        </IconButton>
                        <IconButton
                            size='large'
                            target='_blank'
                            link='https://t.me/orliforsztival'
                            tooltip={lang.footerTelegramAnnounce}
                            tooltipColor='black'
                        >
                            <RiTelegramLine />
                        </IconButton>
                        <IconButton
                            size='large'
                            target='_blank'
                            link='https://x.com/orliforsztival?s=11'
                            tooltip={lang.footerTwitter}
                            tooltipColor='black'
                        >
                            <RiTwitterXFill />
                        </IconButton>
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
                        <ButtonGroup
                            orientation='vertical'
                        >
                            <Button
                                link="/faq"
                                variant='text'
                                startIcon={<RiQuestionLine />}
                                endIcon={<RiExternalLinkLine />}
                            >
                                {lang.footerFaq}
                            </Button>
                            <Button
                                link="/contact"
                                variant='text'
                                startIcon={<RiMailLine />}
                                endIcon={<RiExternalLinkLine />}
                            >
                                {lang.footerContact}
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
            <div className={styles.Footer__Item}>
                <div>
                    <div className={styles.Footer__Item__Title}>
                        <h3>{lang.footerLegal}</h3>
                    </div>
                    <div className={styles.Footer__Item__Legal}>
                        <ButtonGroup
                            orientation='vertical'
                        >
                            <Button
                                link="/legal/rules"
                                variant='text'
                                startIcon={<RiFileList3Line />}
                                endIcon={<RiExternalLinkLine />}
                            >
                                {lang.footerRules}
                            </Button>
                            <Button
                                link="/legal/data"
                                variant='text'
                                startIcon={<RiDatabase2Line />}
                                endIcon={<RiExternalLinkLine />}
                            >
                                {lang.footerData}
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer