import TextCard from "@/comp/TextCard";
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import { ITicket } from "@/models/locale/ticket.model";
import styles from "@/styles/pages/Prices.module.scss"
import { NextPage } from "next";
import { RiPriceTag3Line } from "react-icons/ri";

type Props = {}

const Prices: NextPage<Props> = (props: Props) => {
    const { lang, currLang } = useTranslate();
    const data: ITicket = useLocaleSwitch(currLang, 'ticket.ts')
    const parse = useHTMLString()

    return (
        <>
            <CustomHead title={lang.navPrices} />
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
                        data?.intro.map((o) => {
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
                                title={o.title}
                                variant="simple"
                                customBodyClass={styles.Prices__Body}
                                customTitleClass={styles.Prices__Content__Title}
                            >
                            {
                                o.body.map((p) => {
                                    const str = p+'<br/>'
                                    return parse(str) 
                                })
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
    )
}

export default Prices;