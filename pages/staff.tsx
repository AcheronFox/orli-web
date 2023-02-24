import ParticipantCard from "@/comp/ParticipantCard"
import { useTranslate } from "@/hooks/useTranslate"
import styles from "@/styles/pages/Staff.module.scss"
import { NextPage } from "next"

type Props = {}

const Staff: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate()

  return (
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
    </div>
  )
}

export default Staff;