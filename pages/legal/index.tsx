import styles from "@/styles/pages/Legal.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import IconCard from "@/comp/IconCard";
import { RiDatabase2Line, RiInformationLine, RiFileList3Line } from "react-icons/ri";
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import CustomBackground from "@/comp/CustomBackground";

type Props = {}

const Legal: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <>
      <CustomHead title={t("navLegal")} />
      <CustomBackground />
      <div className={styles.Hub}>
        <div className={styles.Hub__Title}>
            <h1>
                {t("navLegal")}
            </h1>
        </div>
        <div className={styles.Hub__Center}>
          <div className={styles.Hub__Content}>
            <IconCard icon={
                  <>
                      <svg width="0" height="0">
                      <linearGradient id="rule-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop stopColor={styles.primaryColor} offset="0%" />
                          <stop stopColor={styles.secondaryColor} offset="100%" />
                      </linearGradient>
                      </svg>
                      <RiFileList3Line style={{ fill: "url(#rule-gradient)" }} size={"80%"}></RiFileList3Line>
                  </>
              } title={t("legalRules")} link="/legal/rules"
              />

            <IconCard
              icon={
                  <>
                      <svg width="0" height="0">
                      <linearGradient id="data-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop stopColor={styles.primaryColor} offset="0%" />
                          <stop stopColor={styles.secondaryColor} offset="100%" />
                      </linearGradient>
                      </svg>
                      <RiDatabase2Line style={{ fill: "url(#data-gradient)" }} size={"80%"}></RiDatabase2Line>
                  </>
              } title={t("legalData")} link="/legal/data"
              />
          </div>
        </div>
      </div>
    </>
  )
}

export default Legal;
