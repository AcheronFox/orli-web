import styles from "@/styles/pages/Location.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import LinkButton from "@/comp/LinkButton";
import { RiMapPin2Line } from "react-icons/ri";
import InfoCard from "@/comp/InfoCard";
import { NextPage } from "next";

type Props = {}

const Location: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <>
      <a id="accomodation"></a>
      <div className={styles.MainWrapper}>
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
              <LinkButton text={t("locMapOpen")} link="https://goo.gl/maps/UpJbVx4yDh77Lypv8" icon={<RiMapPin2Line />}></LinkButton>
            </div>
          </Section>
          <Section
            id="poi"
            title={t("navPoi")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
            <div className={styles.Location__Poi}>
              <InfoCard
                title="Lidl"
                description="Élelmiszerbolt"
                time={<span><p>H-Sz: 7-21</p><p>V: 7-19</p></span>}
                text={<span><p>Cím: Gárdony, Akácfa utca 2</p><p>Távolság: ~27 perc (gyalog)</p></span>}
                link="https://google.com">
              </InfoCard>
              <InfoCard
                title="Lidl"
                description="Élelmiszerbolt"
                time={<span><p>H-Sz: 7-21</p><p>V: 7-19</p></span>}
                text={<span><p>Cím: Gárdony, Akácfa utca 2</p><p>Távolság: ~27 perc (gyalog)</p></span>}
                link="https://google.com">
              </InfoCard>
              <InfoCard
                title="Lidl"
                description="Élelmiszerbolt"
                time={<span><p>H-Sz: 7-21</p><p>V: 7-19</p></span>}
                text={<span><p>Cím: Gárdony, Akácfa utca 2</p><p>Távolság: ~27 perc (gyalog)</p></span>}
                link="https://google.com">
              </InfoCard>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export default Location;