import CustomHead from "@/comp/CustomHead"
import ParticipantCard from "@/comp/ParticipantCard"
import Section from "@/comp/Section"
import { useTranslate } from "@/hooks/useTranslate"
import styles from "@/styles/pages/Staff.module.scss"
import { NextPage } from "next"

type Props = {}

const Staff: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate()

  return (
    <>
      <CustomHead title={t("navStaff")} />
      <div className={styles.Staff}>
        <div className={styles.Staff__Title}>
          <h1>
            {t("navStaff")}
          </h1>
        </div>
        <div className={styles.Staff__Content}>
          <ParticipantCard name={"aaa"} description={"TEST"}></ParticipantCard>
          <ParticipantCard name={"aaa"} description={"TEST"}></ParticipantCard>
          <ParticipantCard name={"aaa"} description={"TEST"}></ParticipantCard>
          <ParticipantCard name={"aaa"} description={"TEST"}></ParticipantCard>
          <ParticipantCard name={"aaa"} description={"TEST"}></ParticipantCard>
        </div>
        <div className={styles.Staff__Footer}>
          <Section title="TEST">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit aspernatur ipsum pariatur voluptas incidunt, fuga facere maxime temporibus quod repellendus. Quidem numquam dicta totam vero iste rem sapiente, ad iure!
          </Section>
        </div>
      </div>
    </>
  )
}

export default Staff;