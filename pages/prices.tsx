import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import styles from "@/styles/pages/Prices.module.scss"
import { NextPage } from "next";

type Props = {}

const Prices: NextPage<Props> = (props: Props) => {
    const { lang } = useTranslate();

    return (
        <>
            <CustomHead title={lang.navPrices} />
            <div className={styles.Prices__Background} />
            <div className={styles.Prices}>
                <div className={styles.Prices__Content}>
                    <Section>
                        <span>
                            {t("priceIntro")}<br />
                            {t("priceIntro2")}
                        </span>
                    </Section>
                    <Section title={t("pricePack")}>
                        <div className={styles.Prices__Packages}>
                            <div className={styles.Prices__Packages__List}>
                                <PriceCard
                                    title={t("ticket0Title")}
                                    description={
                                    <span>
                                        {t("ticket0Desc")}<br /><br />
                                        {t("ticket0Inc")}<br />
                                        <ul>
                                            <li>{t("ticket0Inc1")}</li>
                                            <li>{t("ticket0Inc2")}</li>
                                            <li>{t("ticket0Inc3")}</li>
                                            <li>{t("ticket0Inc4")}</li>
                                            <li>{t("ticket0Inc5")}</li>
                                        </ul>
                                        <br />
                                        <b>{t("ticket0Out")}</b>
                                    </span>
                                    }
                                    price={8000}
                                />

                                <PriceCard
                                    title={t("ticket1Title")}
                                    description={
                                    <span>
                                        {t("ticket1Desc")}<br /><br />
                                        {t("ticket1Inc")}<br />
                                        <ul>
                                            <li>{t("ticket1Inc1")}</li>
                                            <li>{t("ticket1Inc2")}</li>
                                            <li>{t("ticket1Inc3")}</li>
                                            <li>{t("ticket1Inc4")}</li>
                                            <li>{t("ticket1Inc5")}</li>
                                            <li>{t("ticket1Inc6")}</li>
                                        </ul>
                                        <br />
                                        <b>{t("ticket1Out")}</b>
                                    </span>
                                    }
                                    price={17000}
                                />

                                <PriceCard
                                    title={t("ticket2Title")}
                                    description={
                                    <span>
                                        {t("ticket2Desc")}<br /><br />
                                        {t("ticket2Inc")}<br />
                                        <ul>
                                            <li>{t("ticket2Inc1")}</li>
                                            <li>{t("ticket2Inc2")}</li>
                                            <li>{t("ticket2Inc3")}</li>
                                            <li>{t("ticket2Inc4")}</li>
                                            <li>{t("ticket2Inc5")}</li>
                                            <li>{t("ticket2Inc6")}</li>
                                        </ul>
                                    </span>
                                    }
                                    price={55000}
                                />
                            </div>
                            
                            <div className={`${styles.Prices__Packages__List} ${styles.Prices__Packages__List_2col}`}>
                                <PriceCard
                                    title={t("ticketExtra0")}
                                    description={
                                    <span>
                                        {t("ticketE0Desc")}<br /><br />
                                        {t("ticketE0Inc")}<br />
                                        <ul>
                                            <li>{t("ticketE0Inc1")}</li>
                                            <li>{t("ticketE0Inc2")}</li>
                                            <li>{t("ticketE0Inc3")}</li>
                                            <li>{t("ticketE0Inc4")}</li>
                                            <li>{t("ticketE0Inc5")}</li>
                                        </ul>
                                        <br />
                                        <b>{t("ticketE0Out")}</b>
                                    </span>
                                    }
                                    price={6500}
                                />

                                <PriceCard
                                    title={t("ticketExtra1")}
                                    description={
                                    <span>
                                        {t("ticketE1Desc")}<br /><br />
                                        {t("ticketE1Inc")}<br />
                                        <ul>
                                            <li>{t("ticketE1Inc1")}</li>
                                            <li>{t("ticketE1Inc2")}</li>
                                            <li>{t("ticketE1Inc3")}</li>
                                            <li>{t("ticketE1Inc4")}</li>
                                            <li>{t("ticketE1Inc5")}</li>
                                        </ul>
                                        <br />
                                        <b>{t("ticketE1Out")}</b>
                                    </span>
                                    }
                                    price={6500}
                                />
                            </div>
                        </div>
                    </Section>
                    <Section title={t("priceSupport")} text={
                            <span>
                                {t("ticketSponsorText1")}<br />
                                {t("ticketSponsorText2")}
                            </span>}>
                        <div className={styles.Prices__Packages}>
                            <div className={`${styles.Prices__Packages__List} ${styles.Prices__Packages__List_2col}`}>
                                <PriceCard
                                    title={t("ticketSupport1")}
                                    description={
                                    <span>
                                        {t("ticketSupport1Inc")}<br />
                                        <ul>
                                            <li>{t("ticketSupport1Inc1")}</li>
                                            <li>{t("ticketSupport1Inc2")}</li>
                                            <li>{t("ticketSupport1Inc3")}</li>
                                        </ul>
                                    </span>
                                    }
                                    price={'5000 - 10000'}
                                />
                               <PriceCard
                                    title={t("ticketSupport2")}
                                    description={
                                    <span>
                                        {t("ticketSupport2Inc")}<br />
                                        <ul>
                                            <li>{t("ticketSupport2Inc1")}</li>
                                            <li>{t("ticketSupport2Inc2")}</li>
                                            <li>{t("ticketSupport2Inc3")}</li>
                                        </ul>
                                    </span>
                                    }
                                    price={'10001 <'}
                                />
                            </div>
                        </div>
                    </Section>
                    <Section title={t("priceEarly")} text={t("priceEarlyText")} />
                    <Section>
                        <span>
                            {t("priceOutro1")} {<LinkButton isInternal={true} text={t("priceOutro2")} link={"/programs"} />} {t("priceOutro3")}<br /><br />
                            {t("priceOutro4")}<br />
                            {t("priceOutro5")}
                        </span>
                    </Section>
                </div>
            </div>
        </>
    )
}

export default Prices;