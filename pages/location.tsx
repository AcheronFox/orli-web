import styles from "@/styles/pages/Location.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import LinkButton from "@/comp/LinkButton";
import { RiMapPin2Line } from "react-icons/ri";
import InfoCard from "@/comp/InfoCard";

export default function Location() {
  const { t } = useTranslate();

  const handleButton = () => {
    window.open('http://www.google.com', '_blank')
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
              src="api-key">
            </iframe>
            <div className={styles.Location__Btn}>
              <LinkButton text={t("locMapOpen")} link="https://goo.gl/maps/UpJbVx4yDh77Lypv8" icon={<RiMapPin2Line />}></LinkButton>
            </div>
          </Section>
          <Section
            id="poi"
            title={t("navPoi")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
            <div className={styles.Location__Poi}>
              <InfoCard title="test" buttonAction={handleButton}></InfoCard>
              <InfoCard title="test" buttonAction={handleButton}></InfoCard>
              <InfoCard title="test" buttonAction={handleButton}></InfoCard>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}
