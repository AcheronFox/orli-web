import CustomHead from "@/comp/CustomHead";
import { useTranslate } from "@/hooks/useTranslate";
import styles from "@/styles/pages/Home.module.scss"
import { NextPage } from "next";

type Props = {}

const Programs: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate()

  return (
    <>
      <CustomHead title={t("navPrograms")} />
      <div className={styles.Home}>
        Programs
      </div>
    </>
  )
}


export default Programs;