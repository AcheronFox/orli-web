import styles from "@/styles/pages/Location.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import PrimaryButton from "@/comp/PrimaryButton";

export default function Location() {
  const { t } = useTranslate();

  const handleButton = () => {
    console.log("press")
  }

  return (
    <>
      <a id="accomodation"></a>
      <div className={styles.MainWrapper}>
        <div className={styles.BG__Img}></div>
        <div className={styles.Title}>
          <h1>
            {t("navLocation")}
          </h1>
        </div>
        <div className={styles.Location}>
          <Section
            title={t("navAccom")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
          </Section>
          <Section
            id="route"
            title={t("navGetting")}
            text={<span className={styles.Location__Text}><span className={styles.Location__Paragraph}>{t("paragraph1")}</span><br/>{t("locGettingThere1")}<br/><br/><span className={styles.Location__Paragraph}>{t("paragraph2")}</span><br/>{t("locGettingThere2")}</span>}
          >
            <iframe className={styles.Location__Map} loading="lazy" allowFullScreen id="page"
              src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ69kFsFf_aUcRKFRa_Sk41lQ&maptype=satellite&key=AIzaSyAGG5qg0tQgoDng2LFWdA9NLG-wBqAs4V8">
            </iframe>
            <div className={styles.Location__Btn}>
              <PrimaryButton text="TESTTESTTESTTEST" onClick={handleButton} type="left"></PrimaryButton>
              <PrimaryButton text="TESTTESTTESTTEST" onClick={handleButton} type="center"></PrimaryButton>
              <PrimaryButton text="TESTTESTTESTTEST" onClick={handleButton} type="right"></PrimaryButton>
            </div>
          </Section>
          <Section
            id="poi"
            title={t("navPoi")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
          </Section>
        </div>
      </div>
    </>
  )
}
