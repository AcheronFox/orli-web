import TextCard from "@/comp/TextCard"
import CustomHead from "@/comp/utils/CustomHead"
import useTranslate from "@/hooks/translate/useTranslate"
import { useHTMLString } from "@/hooks/utils/useHTMLString"
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch"
import { IStaff } from "@/models/locale/staff.model"
import styles from "@/styles/pages/Staff.module.scss"
import { NextPage } from "next"
import { RiUser2Line } from "react-icons/ri"

type Props = {}

const Staff: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate()
  const data: IStaff[] = useLocaleSwitch(currLang, "staff.ts")
  const parse = useHTMLString()

  return (
    <>
      <CustomHead title={lang.navStaff} />
      <div className={styles.Staff__Background} />
      <div className={styles.Staff}>
        <TextCard
          variant="filled"
          shadowEnabled
          customBodyClass={styles.Staff__Body}
          icon={<RiUser2Line />}
          image={{
            imgPath: 'stickers/st_dusk.png',
            alt: "Dusk Sticker",
            sizes: "(max-width: 1400px) 50vw, 20vw"
          }}
          imagePlacement="right"
          floatIcon
        >
          {lang.staffIntro}
        </TextCard>
      </div>
      <div className={styles.Staff__Content}>
        {
          data?.map((staff, i) => {
            return (
              <TextCard
                key={i}
                variant="contained"
                shadowEnabled
                customTitleClass={styles.Staff__Title}
                customBodyClass={styles.Staff__Body}
                title={staff.name}
                image={{
                  imgPath: staff.picture,
                  alt: `Staff Img ${i}`,
                  sizes: "(max-width: 1400px) 100vw, 40vw",
                }}
              >
                {
                  staff?.description.map((p) => {
                    const str = p+'<br/>'
                    return parse(str) 
                  })
                }
              </TextCard>
            );
          })
        }
      </div>
    </>
  )
}

export default Staff;