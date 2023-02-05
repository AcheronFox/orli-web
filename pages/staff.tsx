import styles from "@/styles/pages/Home.module.scss"
import { NextPage } from "next"

type Props = {}

const Staff: NextPage<Props> = (props: Props) => {
  return (
    <div className={styles.Home}>
      Staff
    </div>
  )
}

export default Staff;