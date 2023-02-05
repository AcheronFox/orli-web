import InfoPanel from "@/comp/InfoPanel"
import Section from "@/comp/Section"
import styles from "@/styles/pages/Faq.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";

type Props = {}

const FAQ: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <div className={styles.MainWrapper}>
      <div className={styles.Title}>
          <h1>
            {t("footerFaq")}
          </h1>
        </div>
      <div className={styles.Content}>
        <Section title="">
          <div className={styles.Content__Questions}>
            <InfoPanel title="test">
              test
            </InfoPanel>
            <InfoPanel title="test">
              test
            </InfoPanel>
            <InfoPanel title="test">
              test
            </InfoPanel>
            <InfoPanel title="test">
              test
            </InfoPanel>
            <InfoPanel title="test">
              testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
            </InfoPanel>
            <InfoPanel title="test">
              test
            </InfoPanel>
          </div>
        </Section>
      </div>
    </div>
  )
}

export default FAQ;