/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/tempWIP.module.scss"
import { NextPage } from "next";
import { useMemo } from "react";
import CustomHead from "./utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import Picture from "./utils/Picture";
import Button from "./button/Button";

type Props = {};
    
const TempWIP: NextPage<Props> = (props: Props) => {
    const { currLang } = useTranslate()

    const tempLang = useMemo(() => {
        if (currLang == 'en') {
            return {
                title: "W.I.P.",
                subTitle: "Work In Progress",
                desc: "This page is under development. Hang tight while our developers work on getting it ready as soon as possible!",
                button: "Home Page",
            }
        }
        else {
            return {
                title: "Hamarosan...",
                subTitle: "Hamarosan...",
                desc: "Ez az oldal fejlesztés alatt áll. Várj türelemmel ameddig a fejlesztőink azon dolgoznak, hogy a lehető leghamarabb elkészűljön!",
                button: "Kezdőlap",
            }
        }
    }, [currLang])

    return (
        <>
            <CustomHead title={tempLang.title} />
            <div className={styles.WIP__Background} />
            <div className={styles.WIP}>
                <Picture
                    alt={"Dusk Pc Sticker"}
                    defaultSrc={
                        process.env.NODE_ENV == "development"
                        ?
                        `stickers/st_pc.png`
                        :
                        `${process.env.DOMAIN_ROOT}stickers/st_pc.png`
                    }
                    sizes={"(max-width: 1000px) 100vw, 60vw"}
                    className={styles.WIP__Image}
                />
                <h1 className={styles.WIP__Title}>
                    {tempLang.subTitle}
                </h1>
                <span className={styles.WIP__Desc}>
                    {tempLang.desc}
                </span>
                <Button
                    link="/"
                    variant="outlined"
                >
                    {tempLang.button}
                </Button>
            </div>
        </>
    );
};

export default TempWIP;