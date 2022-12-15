import styles from "@/styles/pages/Location.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import GoogleMapReact from 'google-map-react';

export default function Location() {
  const { t } = useTranslate();

  const defaultNav = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  return (
    <>
      <a id="route"></a>
      <div className={styles.MainWrapper}>
        <div className={styles.Title}>
          <h1>
            {t("navLocation")}
          </h1>
        </div>
        <div className={styles.Location}>
          <Section
            title={t("navGetting")}
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim voluptate ullam perferendis eligendi dicta debitis, molestias, quia assumenda, temporibus reiciendis facilis aspernatur. Neque esse dolore debitis eos tempora expedita optio!"
          >
            <iframe className={styles.Location__Map} loading="lazy" allowFullScreen id="page"
              src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ69kFsFf_aUcRKFRa_Sk41lQ&maptype=satellite&key=AIzaSyAGG5qg0tQgoDng2LFWdA9NLG-wBqAs4V8">
            </iframe>
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
