import styles from "@/styles/pages/Rules.module.scss"
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import TextCard from "@/comp/TextCard";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import { ILegal } from "@/models/locale/legal.model";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import { RiFileList3Line } from "react-icons/ri";

type Props = {}

const Rules: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate();
  const data: ILegal = useLocaleSwitch(currLang, "legal.ts")
  const clean = useHTMLString()

  return (
    <>
      <CustomHead title={lang.legalRules} />
      <div className={styles.Legal}>
        <TextCard
          title={lang.legalRules}
          variant="filled"
          shadowEnabled
          icon={<RiFileList3Line />}
        >
          {
            data?.rules.intro.map((o) => {
              const str = o+'<br/>'
              return clean(str)
            })
          }
        </TextCard>
        <TextCard
          variant="filled"
          shadowEnabled
          customBodyClass={styles.Legal__Body}
        >
          {
            data?.rules.body.map((o) => {
              const str = o+'<br/>'
              return clean(str)
            })
          }
        </TextCard>
      </div>
    </>
  )
}

export default Rules;