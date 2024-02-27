import styles from "@/styles/pages/Faq.module.scss"
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import TextCard from "@/comp/TextCard";
import { RiQuestionLine, RiSearch2Line } from "react-icons/ri";
import { IFAQ } from "@/models/locale/faq.model";
import Input from "@/comp/input/Input";
import IconButton from "@/comp/button/IconButton";

type Props = {}

const FAQ: NextPage<Props> = (props: Props) => {
  const [searchParam, setSearchParam] = useState<string>('')

  const { lang, currLang } = useTranslate();
  const data: IFAQ = useLocaleSwitch(currLang, 'faq.ts')

  return (
    <>
      <CustomHead title={lang.navFaq} />
      <div className={styles.Faq__Background} />
      <div className={styles.Faq}>
        <TextCard
          variant="filled"
          icon={<RiQuestionLine />}
        >
          {lang.faqIntro}
          <br />
          <Input 
            label={lang.faqSearch}
            startAdornment={
              <RiSearch2Line />
            }
            value={searchParam}
            onChange={(val) => setSearchParam(val)}
          />
        </TextCard>
        <TextCard>
            {
              Object.keys(data).map((o, i) => {
                return(
                  <IconButton>
                    
                  </IconButton>
                )
              })
            }
        </TextCard>
        {
          /*
          <Section title="">
          <div>
            <span>
              {t("faqIntro")}
            </span>
            <div className={styles.Content__Questions}>
              {
                questions &&
                questions.map((val, i) => {
                  return (
                  <InfoPanel key={i} title={val.title}>
                    {
                      (typeof val.content === "string" && val.content.includes('$') && val.content.includes('ß')) &&
                      <span>
                        {
                          (val.content as string).split(/[$ß]/).map((cont, i) => {
                            return (
                            <span key={i}>
                              {
                                (isValidUrl(cont)) &&
                                <LinkButton text={cont} link={cont}></LinkButton>
                              }
                              {
                                (!isValidUrl(cont)) &&
                                cont
                              }
                            </span>
                            )
                          })
                        }
                      </span>
                    }
                    {
                      (typeof val.content === "string" && !val.content.includes('$') && !val.content.includes('ß')) &&
                      val.content
                    }
                    {
                      (Array.isArray(val.content)) &&
                      <ul className={styles.Content__Questions__List}>
                        {
                          (val.content as Array<string>).map((cont, i) => {
                            return (
                              <li key={i}>{cont}</li>
                            );
                          }) 
                        }
                      </ul>
                    }
                  </InfoPanel>
                  )
                })
              }
            </div>
          </div>
        </Section>
          */
        }
      </div>
    </>
  )
}

export default FAQ;