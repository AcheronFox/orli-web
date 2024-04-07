import TextCard from "@/comp/TextCard";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import axiosInstance from "@/functions/utils/axiosConfig";
import useTranslate from "@/hooks/translate/useTranslate";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import { IAppConfig } from "@/models/app.config.model";
import { ITicket } from "@/models/locale/ticket.model";
import styles from "@/styles/pages/Prices.module.scss"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { RiPriceTag3Line } from "react-icons/ri";
import BarLoader from "react-spinners/BarLoader";
import variables from "@/styles/abstracts/exports.module.scss"

type Props = {}

const Prices: NextPage<Props> = (props: Props) => {
    const { lang, currLang } = useTranslate();
    const data: ITicket = useLocaleSwitch(currLang, 'ticket.ts')
    const [configData, setConfigData] = useState<IAppConfig["ticket"]>()
    const parse = useHTMLString()

    useEffect(() => {
        axiosInstance.get<IAppConfig["ticket"]>('/api/v2/defaults/ticket')
        .then((res) => {
            setConfigData(res.data)
        })
    }, [])

    return (
        <>
            <CustomHead title={lang.navPrices} />
            <LoadingOverlay
                isLoading={configData == undefined}
            >
                <BarLoader
                    width={"100%"}
                    color={variables.secondaryColor}
                />
            </LoadingOverlay>
            {
                (configData != undefined) &&
                <>
                    <div className={styles.Prices__Background} />
                    <div className={styles.Prices}>
                        <TextCard
                            title={lang.navPrices}
                            variant="filled"
                            shadowEnabled
                            icon={<RiPriceTag3Line />}
                            customBodyClass={styles.Prices__Body}
                            customTitleClass={styles.Prices__Title}
                        >
                            {
                                data?.intro.map((o, i) => {
                                    if (i+1 >= data.intro.length && !configData.isEarlyBird) return;
                                    const str = o+'<br/>'
                                    return parse(str)
                                })
                            }
                        </TextCard>
                        <TextCard
                            variant="contained"
                            shadowEnabled
                            customBodyClass={styles.Prices__Body}
                            customTitleClass={styles.Prices__Title}
                        >
                            <div className={styles.Prices__Content}>
                            {
                                data?.content.map((o, i) => {
                                return (
                                    <TextCard
                                        key={i}
                                        variant="simple"
                                        title={o.title}
                                        customBodyClass={styles.Prices__Body}
                                        customTitleClass={styles.Prices__Content__Title}
                                    >
                                    {
                                        o.body.map((p) => {
                                            const str = p+'<br/>'
                                            return parse(str) 
                                        })
                                    }
                                    {
                                        (() => {
                                            if (!o.priceKey) return null
                                            const ticketObj = configData.types.find((p) => p.name === o.priceKey)
                                            
                                            if (ticketObj) {
                                                if (configData.isEarlyBird && ticketObj.earlyBirdPrice) {
                                                    return parse(`<b><s>${ticketObj.price}</s> ${ticketObj.earlyBirdPrice} HUF</b><br/><br/>`)
                                                }
                                                else return parse(`<b>${ticketObj.price} HUF${(ticketObj.name==="SSPONS")? ' <' : ''}</b><br/><br/>`)
                                            }
                                            else return null
                                        })()
                                    }
                                    </TextCard>
                                )
                                })
                            }
                            </div>
                        </TextCard>
                        <TextCard
                            variant="filled"
                            shadowEnabled
                            customBodyClass={styles.Prices__Body}
                            customTitleClass={styles.Prices__Title}
                            floatImage
                            image={{
                                sizes: "(max-width: 1400px) 50vw, 20vw",
                                alt: 'Cocktail sticker',
                                imgPath: 'stickers/st_cocktail.png'
                            }}
                            imagePlacement="right"
                        >
                            {
                                data?.outro.map((o) => {
                                    const str = o+'<br/>'
                                    return parse(str)
                                })
                            }
                        </TextCard>
                    </div>
                </>
            }
        </>
    )
}

export default Prices;