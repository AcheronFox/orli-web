import CustomHead from "@/comp/utils/CustomHead";
import TextCard from "@/comp/TextCard";
import useTranslate from "@/hooks/translate/useTranslate";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
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
            variant="contained"
            shadowEnabled
            customBodyClass={styles.Programs__Body}
            customTitleClass={styles.Programs__Title}
            floatImage
            image={{
              sizes: "(max-width: 1400px) 50vw, 20vw",
              alt: "Explain Sticker",
              imgPath: "stickers/st_explain.png",
            }}
            imagePlacement="right"
          >
            {
              data?.body.map((o, i) => {
                const str = o+'<br/>'
                return parse(str)
              })
            }
            <div className={styles.Programs__Content}>
              {
                data?.content.map((o, i) => {
                  return (
                    <TextCard
                      key={i}
                      title={o.title}
                      variant="simple"
                      customBodyClass={styles.Programs__Body}
                      customTitleClass={styles.Programs__Content__Title}
                    >
                      {
                        o.body.map((p) => {
                          const str = p+'<br/>'
                          return parse(str) 
                        })
                      }
                    </TextCard>
                  )
                })
              }
            </div>
          </TextCard>
      </div>
    </>
  )
}


export default Programs;