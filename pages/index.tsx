import styles from "@/styles/pages/Home.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <div>
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
          
        </div>
      </section>
    </div>
  )
}

export default Home;