import styles from "@/styles/pages/Profile.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <div className={styles.Profile}>
      <div className={styles.Profile__Content}>
        <section className={styles.Profile__Header}>
          head
        </section>
        <section className={styles.Profile__Body}>
          <div>
            body left
          </div>
          <div>
            body right
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home;