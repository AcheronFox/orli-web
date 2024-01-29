import styles from "@/styles/pages/Location.module.scss"
import { RiMapPin2Line, RiArrowLeftUpFill } from "react-icons/ri";
import { NextPage } from "next";
import {fromLonLat} from 'ol/proj';
import {Point} from 'ol/geom';
import 'ol/ol.css';
import {RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle, MapBrowserEvent} from 'rlayers';
import { useEffect, useState } from "react";
import CustomHead from "@/comp/CustomHead";
import { IPOI } from "@/models/poi.model";
import useTranslate from "@/hooks/translate/useTranslate";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";

type Props = {}

const Location: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate();
  const [didInit, setDidInit] = useState<boolean>(false)

  useEffect(() => {
    setDidInit(true)
  }, [])

  const POIs: IPOI[] = useLocaleSwitch(currLang, "poi.json")

  const onPointermove = (e: MapBrowserEvent<UIEvent>) => {
    const pixel = e.target.getEventPixel(e.originalEvent);
    const hit = e.target.hasFeatureAtPixel(pixel);
    e.target.getViewport().style.cursor = hit ? 'pointer' : '';
  }

  return (
    <>
      <CustomHead title={lang.navLocation} />
      <div className={styles.MainWrapper}>
        <div className={styles.Title}>
          <h1>
            {lang.navLocation}
          </h1>
        </div>
        <div className={styles.Location}>
          {
            /*
            <Section
            title={lang.navEventCenter}
            text={lang.locEventC1}
          >
            <span className={styles.Location__Buttons}>
              {lang.locEventC20} {<LinkButton isInternal={true} text={lang.locPolicy} link={"/legal/rules"} />} {`${lang.locEventC21} ${lang.locEventC22}`} {<LinkButton isInternal={true} text={lang.locFAQ} link={"/faq"} />} {lang.locEventC23}
            </span>
          </Section>
          <Section
            title={lang.navAccom}
            text={<span>{lang.locAccom1}<br /><br />{lang.locAccom2}</span>}
          >
            <span>
              <br />{lang.locAccom3} {<b>{lang.locAccom31}</b>} {lang.locAccom32}<br/>
              {lang.locAccom4}<br/><br/><br/>
              <span className={styles.Location__Title}><h3>{lang.locAccomT1}</h3></span>
              <ul>
                <li>{lang.locAccomT1L1}</li>
                <li>{lang.locAccomT1L2}</li>
                <li>{lang.locAccomT1L3}</li>
                <li>{lang.locAccomT1L4}</li>
              </ul>
              <br />
              <span className={styles.Location__Title}><h3>{lang.locAccomT2}</h3></span>
              <ul>
                <li>{lang.locAccomT2L1}</li>
                <li>{lang.locAccomT2L2}</li>
                <li>{lang.locAccomT2L3}</li>
                <li>{lang.locAccomT2L4}</li>
              </ul>
              <br />
              <span className={styles.Location__Title}><h3>{lang.locAccomT3}</h3></span>
              <ul>
                <li>{lang.locAccomT3L1}</li>
                <li>{lang.locAccomT3L2}</li>
                <li>{lang.locAccomT3L3}</li>
                <li>{lang.locAccomT3L4}</li>
              </ul>
              <br />
              <span className={styles.Location__Title}><h3>{lang.locAccomT4}</h3></span>
              <ul>
                <li>{lang.locAccomT4L1}</li>
                <li>{lang.locAccomT4L2}</li>
                <li>{lang.locAccomT4L3}</li>
                <li>{lang.locAccomT4L4}</li>
              </ul>
            </span>
          </Section>
          <Section
            title={lang.navGetting}
          > 
            <span>
              <br />
              <span className={styles.Location__Title}><h3>{lang.locGetting1}</h3></span>
              {lang.locGetting1L1}<br />
              {lang.locGetting1L2}<br /><br />
              <span className={styles.Location__Title}><h3>{lang.locGetting2}</h3></span>
              {lang.locGetting2L1}<br />
              {lang.locGetting2L2}<br /><br />
              <span className={styles.Location__Title}><h3>{lang.locGetting3}</h3></span>
              {lang.locGetting3L1}<br />
              {lang.locGetting3L2}<br /><br />
              <span className={styles.Location__Title}><h3>{lang.locGetting4}</h3></span>
              {lang.locGetting4L1}<br />
              {lang.locGetting4L2}<br /><br />
              <span className={styles.Location__Title}><h3>{lang.locGetting5}</h3></span>
              {lang.locGetting5L1}<br />
              {lang.locGetting5L2}<br /><br />
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
                        {lang.locLocation}
                        <br />
                        <em><RiArrowLeftUpFill /> {lang.locZoom}</em>
                    </ROverlay>
                  </RFeature>
                </RLayerVector>
              </RMap>
            }
            <div className={styles.Location__Btn}>
              <LinkButton text={lang.locMapOpen} link="https://goo.gl/maps/UpJbVx4yDh77Lypv8" icon={<RiMapPin2Line />}></LinkButton>
            </div>
          </Section>
          <Section
            title={lang.navPoi}
            text={lang.locPoi}
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
                        <p>{`${lang.locAddress}: ${poi.address}`}</p>
                        <p>{`${lang.locDistance}: ${poi.distance}`}</p>
                        </span>}
                      link={poi.link}
                    />
                  );
                })
              }
            </div>
          </Section>
            */
          }
        </div>
      </div>
    </>
  )
}

export default Location;