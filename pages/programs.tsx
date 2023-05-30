import CustomHead from "@/comp/CustomHead";
import LinkButton from "@/comp/LinkButton";
import Section from "@/comp/Section";
import { useTranslate } from "@/hooks/useTranslate";
import styles from "@/styles/pages/Programs.module.scss"
import { NextPage } from "next";
import { useEffect, useState } from "react";

type Props = {}
interface CustomProgramInterface {title: string; description: string[];}

const Programs: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate()
  const [programs, setPrograms] = useState<CustomProgramInterface[]>(
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
                programs.map((val, i) => {
                  return (
                    <div key={i}>
                      <br />
                      <span>
                        <span className={styles.Programs__Content__Title}><h3>{val.title}</h3></span>
                        <div className={styles.Programs__Content__Desc}>
                          {
                            programs[i].description.map((content, j) => {
                              return (
                                <span key={j}>
                                    {
                                      (isValidUrl(content)) &&
                                      <LinkButton text={content} link={content}></LinkButton>
                                    }
                                    {
                                      (!isValidUrl(content)) &&
                                      content
                                    }
                                  <br />
                                </span>
                              );
                            })
                          }
                        </div>
                      </span>
                    </div>
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