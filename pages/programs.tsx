import styles from "@/styles/pages/Home.module.scss"
import { NextPage } from "next";

type Props = {}

const Programs: NextPage<Props> = (props: Props) => {
  return (
    <div className={styles.Home}>
      Programs
    </div>
  )
}


export default Programs;