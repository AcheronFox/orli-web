import styles from "@/styles/pages/Rules.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import CustomBackground from "@/comp/CustomBackground";

type Props = {}
type CustomRuleContentInternal = {
  title: string;
  content: string[] | [{content: string[]}]
}

const Rules: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <>
      <CustomHead title={t("legalRules")} />
      <CustomBackground />
      <div className={styles.Rules}>
        <div className={styles.Rules__Title}>
          <h1>
            {t("legalRules")}
          </h1>
        </div>
        <div className={styles.Rules__Content}>
          <Section>
            <span>
              {t("polHea1")}<br/>
              {t("polHea2")}<br/>
              {t("polHea3")}<br/><br/>
              {t("polHea4")}<br/><br/>
              <small>{t("polHea5")}</small>
            </span>
          </Section>
          <Section>
            <div className={styles.Rules__Main}>
              {
                Object.keys(t("polBody")).map((rawKey, i) => {
                  const key = parseInt(rawKey)
                  const dataObj = t("polBody")[key] as unknown as CustomRuleContentInternal

                  return (
                    <span className={styles.Rules__Main__Data} key={i}>
                      <h3>{`${dataObj.title}:`}</h3>
                      <ol className={styles.Rules__Main__List}>
                        {
                          dataObj.content.map((val, j) => {
                            if ((typeof val === 'object' && val !== null)) {
                              return (
                                  <span key={j}>
                                    {
                                      <ol type="a" className={styles.Rules__Main__List}>
                                        {
                                          val.content.map((internalVal, l) => {
                                            return (
                                              <li key={l}>
                                                {internalVal}
                                              </li>
                                            );
                                          })
                                        }
                                      </ol>
                                    }
                                  </span>
                              );
                            }
                            else return (<li key={j}>{val}</li>)
                          })
                        }
                      </ol>
                    </span>
                  );
                })
              }
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export default Rules;