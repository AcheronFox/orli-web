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
import CustomHead from "@/comp/CustomHead";
import { IPOI } from "@/models/poi.model";

type Props = {}

const Location: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const [didInit, setDidInit] = useState<boolean>(false)

  useEffect(() => {
    setDidInit(true)
  }, [])

  const [POIs, setPOIs] = useState<IPOI[]>(
    locale == "en"
        ? require("../locales/en.poi.json")
        : require("../locales/hu.poi.json")
  );

  useEffect(() => {
    setPOIs(
      locale == "en"
        ? require("../locales/en.poi.json")
        : require("../locales/hu.poi.json")
    )
  }, [locale])

  const onPointermove = (e: MapBrowserEvent<UIEvent>) => {
    const pixel = e.target.getEventPixel(e.originalEvent);
    const hit = e.target.hasFeatureAtPixel(pixel);
    e.target.getViewport().style.cursor = hit ? 'pointer' : '';
  }

  return (
    <>
      <CustomHead title={t("navLocation")} />
      <a id="eventCenter"></a>
      <div className={styles.MainWrapper}>
        <div className={styles.Title}>
          <h1>
            {t("navLocation")}
          </h1>
        </div>
        <div className={styles.Location}>
          <Section
            title={t("navEventCenter")}
            text={t("locEventC1")}
          >
            <span className={styles.Location__Buttons}>
              {t("locEventC20")} {<LinkButton isInternal={true} text={t("locPolicy")} link={"/legal/rules"} />} {`${t("locEventC21")} ${t("locEventC22")}`} {<LinkButton isInternal={true} text={t("locFAQ")} link={"/faq"} />} {t("locEventC23")}
            </span>
          </Section>
          <Section
            id="accomodation"
            title={t("navAccom")}
            text={<span>{t("locAccom1")}<br /><br />{t("locAccom2")}</span>}
          >
            <span>
              <br />{t("locAccom3")} {<b>{t("locAccom31")}</b>} {t("locAccom32")}<br/>
              {t("locAccom4")}<br/><br/><br/>
              <span className={styles.Location__Title}><h3>{t("locAccomT1")}</h3></span>
              <ul>
                <li>{t("locAccomT1L1")}</li>
                <li>{t("locAccomT1L2")}</li>
                <li>{t("locAccomT1L3")}</li>
                <li>{t("locAccomT1L4")}</li>
              </ul>
              <br />
              <span className={styles.Location__Title}><h3>{t("locAccomT2")}</h3></span>
              <ul>
                <li>{t("locAccomT2L1")}</li>
                <li>{t("locAccomT2L2")}</li>
                <li>{t("locAccomT2L3")}</li>
                <li>{t("locAccomT2L4")}</li>
              </ul>
              <br />
              <span className={styles.Location__Title}><h3>{t("locAccomT3")}</h3></span>
              <ul>
                <li>{t("locAccomT3L1")}</li>
                <li>{t("locAccomT3L2")}</li>
                <li>{t("locAccomT3L3")}</li>
                <li>{t("locAccomT3L4")}</li>
              </ul>
              <br />
              <span className={styles.Location__Title}><h3>{t("locAccomT4")}</h3></span>
              <ul>
                <li>{t("locAccomT4L1")}</li>
                <li>{t("locAccomT4L2")}</li>
                <li>{t("locAccomT4L3")}</li>
                <li>{t("locAccomT4L4")}</li>
              </ul>
            </span>
          </Section>
          <Section
            id="route"
            title={t("navGetting")}
          > 
            <span>
              <br />
              <span className={styles.Location__Title}><h3>{t("locGetting1")}</h3></span>
              {t("locGetting1L1")}<br />
              {t("locGetting1L2")}<br /><br />
              <span className={styles.Location__Title}><h3>{t("locGetting2")}</h3></span>
              {t("locGetting2L1")}<br />
              {t("locGetting2L2")}<br /><br />
              <span className={styles.Location__Title}><h3>{t("locGetting3")}</h3></span>
              {t("locGetting3L1")}<br />
              {t("locGetting3L2")}<br /><br />
              <span className={styles.Location__Title}><h3>{t("locGetting4")}</h3></span>
              {t("locGetting4L1")}<br />
              {t("locGetting4L2")}<br /><br />
              <span className={styles.Location__Title}><h3>{t("locGetting5")}</h3></span>
              {t("locGetting5L1")}<br />
              {t("locGetting5L2")}<br /><br />
            </span>
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
            text={t("locPoi")}
          >
            <div className={styles.Location__Poi}>
              {
                POIs.map((poi, i) => {
                  return(
                    <InfoCard
                      key={i}
                      title={poi.title}
                      description={poi.description}
                      time={<span>{
                          poi.time.map((time, j) => {
                            return (
                              <p key={j}>{time}</p>
                            );
                          })
                        }</span>}
                      text={<span>
                        <p>{`${t("locAddress")}: ${poi.address}`}</p>
                        <p>{`${t("locDistance")}: ${poi.distance}`}</p>
                        </span>}
                      link={poi.link}
                    />
                  );
                })
              }
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export default Location;