import TextCard from "@/comp/TextCard"
import Button from "@/comp/button/Button"
import CustomHead from "@/comp/utils/CustomHead"
import useTranslate from "@/hooks/translate/useTranslate"
import { useHTMLString } from "@/hooks/utils/useHTMLString"
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch"
import { IStaff } from "@/models/locale/staff.model"
import styles from "@/styles/pages/Staff.module.scss"
import { NextPage } from "next"
import { RiTelegramLine, RiUser2Line } from "react-icons/ri"

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
          icon={<RiUser2Line />}
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
                    const str = p
                    return parse(str) 
                  })
                }
                {
                  (staff.link != undefined) &&
                  <div className={styles.Staff__Button}>
                    <Button
                      link={staff.link}
                      target="_blank"
                      variant="outlined"
                      startIcon={<RiTelegramLine size={20}/>}
                    >
                      Telegram
                    </Button>
                  </div>
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