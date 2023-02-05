import PriceCard from "@/comp/PriceCard"
import { useTranslate } from "@/hooks/useTranslate";
import styles from "@/styles/pages/Prices.module.scss"
import { NextPage } from "next";

type Props = {}

const Prices: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();

    return (
        <div className={styles.Prices}>
            <div className={styles.Prices__Title}>
                <h1>
                    {t("navPrices")}
                </h1>
            </div>
            <div className={styles.Prices__Content}>
                <PriceCard title="Test" price="10000" euro="200" description={
                    <span>Includes:<br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, minima praesentium. Aut optio ea velit culpa voluptas deleniti corporis totam dolor magnam cum vitae reprehenderit, repellat impedit exercitationem quaerat ad!</span>
                }></PriceCard>
                <PriceCard title="Test2" price="10000" euro="200" description={
                    <span>Includes:<br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, minima praesentium. Aut optio ea velit culpa voluptas deleniti corporis totam dolor magnam cum vitae reprehenderit, repellat impedit exercitationem quaerat ad!</span>
                }></PriceCard>
                <PriceCard title="Test2" price="10000" euro="200" description={
                    <span>Includes:<br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, minima praesentium. Aut optio ea velit culpa voluptas deleniti corporis totam dolor magnam cum vitae reprehenderit, repellat impedit exercitationem quaerat ad!</span>
                }></PriceCard>
                <PriceCard title="Test2" price="10000" euro="200" description={
                    <span>Includes:<br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, minima praesentium. Aut optio ea velit culpa voluptas deleniti corporis totam dolor magnam cum vitae reprehenderit, repellat impedit exercitationem quaerat ad!</span>
                }></PriceCard>
                <PriceCard title="Test2" price="10000" euro="200" description={
                    <span>Includes:<br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, minima praesentium. Aut optio ea velit culpa voluptas deleniti corporis totam dolor magnam cum vitae reprehenderit, repellat impedit exercitationem quaerat ad!</span>
                }></PriceCard>
            </div>
        </div>
    )
}

export default Prices;