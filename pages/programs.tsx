import CustomHead from "@/comp/CustomHead";
import LinkButton from "@/comp/LinkButton";
import Section from "@/comp/Section";
import { useTranslate } from "@/hooks/useTranslate";
import styles from "@/styles/pages/Programs.module.scss"
import { NextPage } from "next";
import { useEffect, useState } from "react";

type Props = {}
interface CustomProgramInterface {[index: number]: {title: string; description: string[];} }

const Programs: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate()
  const [programs, setPrograms] = useState<CustomProgramInterface>(
    locale == "en"
      ? require("../locales/en.programs.json")
      : require("../locales/hu.programs.json")
  );

  useEffect(() => {
    setPrograms(
      locale == "en"
      ? require("../locales/en.programs.json")
      : require("../locales/hu.programs.json")
    )
  }, [locale])

  return (
    <>
      <CustomHead title={t("navPrograms")} />
      <div className={styles.Programs}>
        <div className={styles.Programs__Title}>
            <h1>
                {t("navPrograms")}
            </h1>
        </div>
        <div className={styles.Programs__Content}>
          <Section>
            <span>
              {t("progIntro1")}<br />
              {t("progIntro2")}<br />
              {t("progIntro3")} {<LinkButton text={"orlifurstival@gmail.com"} link={"mailto:orlifurstival@gmail.com"} isInternal={false}></LinkButton>} {t("progIntro4")}
            </span>
          </Section>
          <Section
            title={t("progList")}
          >
            <span>
              {
                (programs != undefined) &&
                Object.keys(programs).map((index, i) => {
                  const key = parseInt(index)
                  return (
                    <>
                      <br key={i}/>
                      <span key={i}>
                        <span className={styles.Programs__Content__Title}><h3>{programs[key].title}</h3></span>
                        <div className={styles.Programs__Content__Desc}>
                          {
                            programs[key].description.map((content, i) => {
                              return (
                                <>
                                  <span key={i}>
                                    {content}
                                  </span>
                                  <br />
                                </>
                              );
                            })
                          }
                        </div>
                      </span>
                    </>
                  );
                })
              }
            </span>
          </Section>
        </div>
      </div>
    </>
  )
}


export default Programs;