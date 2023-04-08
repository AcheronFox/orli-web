import PrimaryButton from "@/comp/PrimaryButton"
import styles from "@/styles/pages/Home.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import VideoPlayer from "@/comp/VideoPlayer";

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <div>
      <section className={styles.Home}>
        <div className={styles.Home__TextField}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis facilis nobis dignissimos obcaecati voluptatem ad impedit ducimus, at voluptates? Id culpa itaque repellendus numquam magnam, odio est recusandae deserunt sapiente?
          <div className={styles.Home__TextField__Content}>
            {
              
            }
          </div>
          <div className={styles.Home__TextField__Btn}>
            <PrimaryButton text={t("homeReg")} link="/registration"></PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;