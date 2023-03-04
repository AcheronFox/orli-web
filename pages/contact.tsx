/* eslint-disable react-hooks/exhaustive-deps */
import Section from "@/comp/Section"
import { useTranslate } from "@/hooks/useTranslate"
import styles from "@/styles/pages/Contact.module.scss"
import { NextPage } from "next"
import LinkButton from "@/comp/LinkButton";

type Props = {}

const Login: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate()

  return (
    <>
      <div className={styles.Contact}>
        <div className={styles.Contact__Center}>
          <Section title={t("footerContact")}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod aliquam fugiat veritatis velit veniam sit autem, a quasi debitis delectus vel iure explicabo! Quasi deserunt pariatur facilis iure itaque? Cum.
            <div className={styles.Contact__Button}>
              <LinkButton text={"orlifurstival@gmail.com"} link={"mailto:orlifurstival@gmail.com"} isInternal={false}></LinkButton>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export default Login;