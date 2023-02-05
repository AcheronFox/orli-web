import styles from "@/styles/pages/Home.module.scss"
import { NextPage } from "next"

type Props = {}

const Login: NextPage<Props> = (props: Props) => {
  return (
    <div className={styles.Home}>
      Login
    </div>
  )
}

export default Login;