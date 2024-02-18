import CustomHead from "@/comp/CustomHead";
import TextCard from "@/comp/TextCard";
import useTranslate from "@/hooks/translate/useTranslate";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import useIsMobile from "@/hooks/utils/useIsMobile";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import { IProgram } from "@/models/locale/program.model";
import styles from "@/styles/pages/Programs.module.scss"
import { NextPage } from "next";
import { RiClipboardLine } from "react-icons/ri";

type Props = {}

const Programs: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate()
  const data: IProgram = useLocaleSwitch(currLang, 'programs.ts')
  const parse = useHTMLString()
  const isMobile = useIsMobile(true)

  return (
    <>
      <CustomHead title={lang.navPrograms} />
      <div className={styles.Programs__Background} />
      <div className={styles.Programs}>
        <TextCard
          title={lang.navPrograms}
          variant="filled"
          shadowEnabled
          icon={<RiClipboardLine />}
          customBodyClass={styles.Programs__Body}
          customTitleClass={styles.Programs__Title}
        >
          {
            data?.intro.map((o) => {
              const str = o+'<br/>'
              return parse(str)
            })
          }
        </TextCard>
        <TextCard
            title={lang.progList}
            variant="filled"
            shadowEnabled
            customBodyClass={styles.Programs__Body}
            customTitleClass={styles.Programs__Title}
            image={isMobile? undefined : {
              sizes: "(max-width: 1400px) 50vw, 20vw",
              alt: "Explain Sticker",
              imgPath: "stickers/st_explain.png",
            }}
            imagePlacement="right"
          >
            {
              data?.content.map((o) => {
                const str = o+'<br/>'
                return parse(str)
              })
            }
          </TextCard>
      </div>
    </>
  )
}


export default Programs;