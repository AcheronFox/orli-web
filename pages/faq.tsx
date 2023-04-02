import InfoPanel from "@/comp/InfoPanel"
import Section from "@/comp/Section"
import styles from "@/styles/pages/Faq.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import CustomHead from "@/comp/CustomHead";

type Props = {}

interface CustomQuestionInterface {[index: number]: {title: string; content: string;} }

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
            <div className={styles.Content__Questions}>
              {
                questions &&
                Object.keys(questions).map((questionIndex, i) => {
                  const key = parseInt(questionIndex)

                  return (
                  <InfoPanel key={key} title={questions[key].title}>
                    {questions[key].content}
                  </InfoPanel>
                  )
                })
              }
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export default FAQ;