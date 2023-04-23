import CustomHead from "@/comp/CustomHead"
import ParticipantCard from "@/comp/ParticipantCard"
import Section from "@/comp/Section"
import { useTranslate } from "@/hooks/useTranslate"
import { IStaff } from "@/models/staff.model"
import styles from "@/styles/pages/Staff.module.scss"
import { NextPage } from "next"
import { useEffect, useState } from "react"

type Props = {}

const Staff: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate()

  const [staffs, setStaffs] = useState<IStaff[]>(
    locale == "en"
        ? require("../locales/en.staff.json")
        : require("../locales/hu.staff.json")
  );

  useEffect(() => {
    setStaffs(
      locale == "en"
        ? require("../locales/en.staff.json")
        : require("../locales/hu.staff.json")
    )
  }, [locale])

  return (
    <>
      <CustomHead title={t("navStaff")} />
      <div className={styles.Staff}>
        <div className={styles.Staff__Title}>
          <h1>
            {t("navStaff")}
          </h1>
        </div>
        <Section>
          {t("staffIntro")}
        </Section>
        <div className={styles.Staff__Content}>
          {
            staffs.map((staff, i) => {
              return (
                <ParticipantCard
                key={i}
                name={staff.name}
                description={staff.description}
                picture={staff.picture}
                />
              );
            })
          }
        </div>
        <div className={styles.Staff__Footer}>
          <Section title={t("staffVolunteers")}>
          
          </Section>
        </div>
      </div>
    </>
  )
}

export default Staff;