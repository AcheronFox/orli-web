/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Contact.module.scss"
import { NextPage } from "next"
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import TextCard from "@/comp/TextCard";
import Button from "@/comp/button/Button";
import { RiMailLine } from "react-icons/ri";

type Props = {}

const Contact: NextPage<Props> = (props: Props) => {
  const { lang } = useTranslate()

  return (
    <>
      <CustomHead title={lang.footerContact} />
      <div className={styles.Contact__Background} />
      <div className={styles.Contact}>
        <div className={styles.Contact__Center}>
          <TextCard
            title={lang.footerContact}
            variant="filled"
            shadowEnabled
            icon={<RiMailLine />}
          >
            {lang.contact}
            <div className={styles.Contact__Button}>
              <Button
                variant="text"
                link={"mailto:orlifurstival@gmail.com"}
              >
                orlifurstival@gmail.com
              </Button>
            </div>
          </TextCard>
        </div>
      </div>
    </>
  )
}

export default Contact;