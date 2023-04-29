import InfoPanel from "@/comp/InfoPanel"
import Section from "@/comp/Section"
import styles from "@/styles/pages/Faq.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import CustomHead from "@/comp/CustomHead";
import LinkButton from "@/comp/LinkButton";

type Props = {}

interface CustomQuestionInterface {[index: number]: {title: string; content: string[] | string;} }

const FAQ: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const [questions, setQuestions] = useState<CustomQuestionInterface>(
    locale == "en"
      ? require("../locales/en.faq.json")
      : require("../locales/hu.faq.json")
  );

  useEffect(() => {
    setQuestions(
      locale == "en"
      ? require("../locales/en.faq.json")
      : require("../locales/hu.faq.json")
    )
  }, [locale])

  const isValidUrl = (urlString: string) => {
    try { 
      return Boolean(new URL(urlString)); 
    }
    catch(e){ 
      return false; 
    }
  }
  

  return (
    <>
      <CustomHead title={t("navFaq")} />
      <div className={styles.MainWrapper}>
        <div className={styles.Title}>
            <h1>
              {t("footerFaq")}
            </h1>
          </div>
        <div className={styles.Content}>
          <Section title="">
            <div>
              <span>
                {t("faqIntro")}
              </span>
              <div className={styles.Content__Questions}>
                {
                  questions &&
                  Object.keys(questions).map((questionIndex, i) => {
                    const key = parseInt(questionIndex)

                    return (
                    <InfoPanel key={key} title={questions[key].title}>
                      {
                        (typeof questions[key].content === "string" && questions[key].content.includes('$') && questions[key].content.includes('ß')) &&
                        <span>
                          {
                            (questions[key].content as string).split(/[$ß]/).map((cont, i) => {
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
                        (typeof questions[key].content === "string" && !questions[key].content.includes('$') && !questions[key].content.includes('ß')) &&
                        questions[key].content
                      }
                      {
                        (Array.isArray(questions[key].content)) &&
                        <ul className={styles.Content__Questions__List}>
                          {
                            (questions[key].content as Array<string>).map((cont, i) => {
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
        </div>
      </div>
    </>
  )
}

export default FAQ;