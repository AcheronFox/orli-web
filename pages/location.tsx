import styles from "@/styles/pages/Location.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import LinkButton from "@/comp/LinkButton";
import { RiMapPin2Line, RiArrowLeftUpFill } from "react-icons/ri";
import InfoCard from "@/comp/InfoCard";
import { NextPage } from "next";
import {fromLonLat} from 'ol/proj';
import {Point} from 'ol/geom';
import 'ol/ol.css';
import {RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle, MapBrowserEvent} from 'rlayers';
import { useEffect, useState } from "react";

type Props = {}

const Location: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();
  const [didInit, setDidInit] = useState<boolean>(false)

  useEffect(() => {
    setDidInit(true)
  }, [])

  const onPointermove = (e: MapBrowserEvent<UIEvent>) => {
    const pixel = e.target.getEventPixel(e.originalEvent);
    const hit = e.target.hasFeatureAtPixel(pixel);
    e.target.getViewport().style.cursor = hit ? 'pointer' : '';
  }

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
            {
              didInit &&
              <RMap className={styles.Location__Map} initial={{center: fromLonLat([18.5886954, 47.1914420]), zoom: 16}} onPointerMove={(e) => onPointermove(e)}>
                <ROSM />
                <RLayerVector zIndex={10}>
                  <RStyle.RStyle>
                    <RStyle.RIcon scale={.05} src={'/map-pin.svg'} anchor={[0.5, 0.8]} />
                  </RStyle.RStyle>
                  <RFeature
                    geometry={new Point(fromLonLat([18.5886954, 47.1914420]))}
                    onClick={(e) => {
                      const geometry = e.target.getGeometry()
                      if (!geometry) return undefined
                      else
                      return (
                        e.map.getView().fit(geometry.getExtent(), {
                          duration: 250,
                          maxZoom: 16
                        })
                      )
                    }}
                    >
                    <ROverlay className={styles.Location__Map__Overlay}>
                        {t("locLocation")}
                        <br />
                        <em><RiArrowLeftUpFill /> {t("locZoom")}</em>
                    </ROverlay>
                  </RFeature>
                </RLayerVector>
              </RMap>
            }
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