import styles from "@/styles/pages/Faq.module.scss"
import { NextPage } from "next";
import React, { useState } from "react";
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import TextCard from "@/comp/TextCard";
import { FaqCategories, IFaqCategories, IFAQ } from "@/models/locale/faq.model";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import IconButton from "@/comp/button/IconButton";
import { RiArrowGoBackFill } from "react-icons/ri";


type Props = {
    category: IFaqCategories
}

const FAQCategory: NextPage<Props> = (props: Props) => {
    const { lang, currLang } = useTranslate();
    const data: IFAQ = useLocaleSwitch(currLang, 'faq.ts')
    const parse = useHTMLString()
    console.log(props)
    
    if (!props.category) {
        return null
    }

    return (
        <>
            <CustomHead title={lang.navFaq} />
            <div className={styles.Faq__Background} />
            <div className={styles.Faq}>
                <TextCard
                    variant="contained"
                    shadowEnabled
                    customBodyClass={styles.Faq__Search}
                    customTitleClass={styles.Faq__Title__Sub}
                    title={
                        <>
                            {data? data[props.category].translation : undefined}
                            <IconButton
                                link="/faq"
                                size="large"
                            >
                                <RiArrowGoBackFill/>
                            </IconButton>
                        </>
                    }
                >
                    <div className={styles.Faq__Button}>
                        
                    </div>
                    {
                        (data != undefined) &&
                        data[props.category].data.map((o, i) => {
                            return (
                                <div
                                    key={i}
                                    className={styles.Faq__Search__Item}
                                >
                                    <TextCard
                                        variant="simple"
                                        customBodyClass={styles.Faq__Body}
                                        customTitleClass={styles.Faq__Title}
                                        title={
                                            <h4>{parse(o.title)}</h4>
                                        }
                                    >
                                        {o.content.map((v) => {
                                            const str = v + '<br/>'
                                            return parse(str)
                                        })}
                                        <br />
                                        <br />
                                        <br />
                                    </TextCard>
                                </div>
                            )
                        })
                    }
                </TextCard>
            </div>
        </>
    )
}

export default FAQCategory;

export async function getStaticPaths(category: string) {
    const categories = Object.keys(FaqCategories)
    const tempArr: {params: { category: IFaqCategories }}[] = []

    categories.forEach((o) => {
        tempArr.push({ params: { category: o as IFaqCategories } })
    })
    return {
        paths: tempArr,
        fallback: false,
    }
}

export const getStaticProps = ((context: {params: {category: IFaqCategories}}) => {
    return {props: context.params}
})