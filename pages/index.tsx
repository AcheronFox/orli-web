import { NextPage } from "next";
import styles from "@/styles/pages/Home.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import Separator from "@/comp/Separator";
import { RiArrowDropDownLine } from "react-icons/ri"

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  return (
    <div>
      <section className={styles.Home}>
        <Separator IconComp={<RiArrowDropDownLine />} text={t("homeScroll")}></Separator>
      </section>
      <section className={styles.Home__Content}>
        <div className={styles.Home__Wrapper}>
          <span className={styles.Home__Title}>
            <h3>
              {t("homeTitle1")}
            </h3>
            <h3>
              {t("homeTitle2")}
            </h3>
          </span><br /><br />
          <span>
            {t("homeText1")}<br />
            {t("homeText2")}<br /><br />
            {t("homeText3")}<br /><br />
            {t("homeText4")}
          </span><br /><br />
          <div className={styles.Home__Center}>
            <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/ZV7x83_KOIM/" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen={true}></iframe>
          </div><br /><br />
          <span>
            {t("homeText5")}
          </span>
          
          <div className={styles.Home__Btn}>
            <PrimaryButton text={t("homeReg")} link="/registration"></PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;