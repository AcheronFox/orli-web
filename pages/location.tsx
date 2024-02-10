import styles from "@/styles/pages/Location.module.scss"
import { RiMapPin2Line, RiArrowLeftUpFill, RiExternalLinkFill } from "react-icons/ri";
import { NextPage } from "next";
import {fromLonLat} from 'ol/proj';
import {Point} from 'ol/geom';
import 'ol/ol.css';
import {RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle, MapBrowserEvent} from 'rlayers';
import { useEffect, useState } from "react";
import CustomHead from "@/comp/CustomHead";
import { IPOI } from "@/models/locale/poi.model";
import useTranslate from "@/hooks/translate/useTranslate";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import TextCard from "@/comp/TextCard";
import Button from "@/comp/button/Button";

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
      <div className={styles.Location__Background} />
      <div className={styles.Location}>
        <section className={styles.Location__Row}>
          <TextCard
            title={lang.navEventCenter}
            customTitleClass={styles.Location__Title}
            customBodyClass={styles.Location__Body}
            variant="filled"
            shadowEnabled
          >
            {lang.locEventC1}
            <br/>
            <br/>
            <span className={styles.Location__Buttons}>
              {lang.locEventC20}
              {<Button variant="text" endIcon={<RiExternalLinkFill />} link={"/legal/rules"} >{lang.locPolicy}</Button>}
              {`${lang.locEventC21} ${lang.locEventC22}`}
              {<Button variant="text" endIcon={<RiExternalLinkFill />} link={"/faq"} >{lang.locFAQ}</Button>}
              {lang.locEventC23}
            </span>
          </TextCard>
        </section>

        <section className={styles.Location__Row}>
          <TextCard
            title={lang.navAccom}
            customTitleClass={styles.Location__Title}
            customBodyClass={styles.Location__Body}
            variant="filled"
            shadowEnabled
          >
            <span>
              {lang.locAccom1}
            </span>
            <br/>
            <br/>
            <span>
              {lang.locAccom2}
            </span>
            <br/>
            <br/>
            <span>
              {lang.locAccom3} {<b><i>{lang.locAccom31}</i></b>} {lang.locAccom32} {lang.locAccom4}
            </span>
          </TextCard>
          <div className={styles.Location__Row__Items}>
            <TextCard
              title={lang.locAccomT1}
              customTitleClass={styles.Location__Title_Secondary}
              variant="contained"
              shadowEnabled
            >
              <ul>
                <li>{lang.locAccomT1L1}</li>
                <li>{lang.locAccomT1L2}</li>
                <li>{lang.locAccomT1L3}</li>
                <li>{lang.locAccomT1L4}</li>
              </ul>
            </TextCard>
            <TextCard
              title={lang.locAccomT2}
              customTitleClass={styles.Location__Title_Secondary}
              variant="contained"
              shadowEnabled
            >
              <ul>
                <li>{lang.locAccomT2L1}</li>
                <li>{lang.locAccomT2L2}</li>
                <li>{lang.locAccomT2L3}</li>
                <li>{lang.locAccomT2L4}</li>
              </ul>
            </TextCard>
            <TextCard
              title={lang.locAccomT3}
              customTitleClass={styles.Location__Title_Secondary}
              variant="contained"
              shadowEnabled
            >
              <ul>
                <li>{lang.locAccomT3L1}</li>
                <li>{lang.locAccomT3L2}</li>
                <li>{lang.locAccomT3L3}</li>
                <li>{lang.locAccomT3L4}</li>
              </ul>
            </TextCard>
            <TextCard
              title={lang.locAccomT4}
              customTitleClass={styles.Location__Title_Secondary}
              variant="contained"
              shadowEnabled
            >
              <ul>
                <li>{lang.locAccomT4L1}</li>
                <li>{lang.locAccomT4L2}</li>
                <li>{lang.locAccomT4L3}</li>
                <li>{lang.locAccomT4L4}</li>
              </ul>
            </TextCard>
          </div>
        </section>

        <section className={styles.Location__Row}>
          <TextCard
            title={lang.navGetting}
            customTitleClass={styles.Location__Title}
            customBodyClass={styles.Location__Body__Map}
            variant="filled"
            shadowEnabled
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
                        {lang.locLocation}
                        <br />
                        <em><RiArrowLeftUpFill /> {lang.locZoom}</em>
                    </ROverlay>
                  </RFeature>
                </RLayerVector>
              </RMap>
            }
            <div className={styles.Location__Buttons}>
              <Button target="_blank" variant="text" link="https://goo.gl/maps/UpJbVx4yDh77Lypv8" startIcon={<RiMapPin2Line />} endIcon={<RiExternalLinkFill/>}>{lang.locMapOpen}</Button>
            </div>
          </TextCard>
          <div className={styles.Location__Row__Items}>
            <TextCard
              title={lang.locGetting1}
              customTitleClass={styles.Location__Title_Secondary}
              customBodyClass={styles.Location__Body}
              variant="contained"
              shadowEnabled
            >
              {lang.locGetting1L1}<br />
              {lang.locGetting1L2}
            </TextCard>
            <TextCard
              title={lang.locGetting2}
              customTitleClass={styles.Location__Title_Secondary}
              customBodyClass={styles.Location__Body}
              variant="contained"
              shadowEnabled
            >
              {lang.locGetting2L1}<br />
              {lang.locGetting2L2}
            </TextCard>
            <TextCard
              title={lang.locGetting3}
              customTitleClass={styles.Location__Title_Secondary}
              customBodyClass={styles.Location__Body}
              variant="contained"
              shadowEnabled
            >
              {lang.locGetting3L1}<br />
              {lang.locGetting3L2}
            </TextCard>
            <TextCard
              title={lang.locGetting4}
              customTitleClass={styles.Location__Title_Secondary}
              customBodyClass={styles.Location__Body}
              variant="contained"
              shadowEnabled
            >
              {lang.locGetting4L1}<br />
              {lang.locGetting4L2}
            </TextCard>
          </div>
        </section>

        <section className={styles.Location__Row}>
          <TextCard
            title={lang.navPoi}
            customTitleClass={styles.Location__Title}
            customBodyClass={styles.Location__Body}
            variant="filled"
            shadowEnabled
          >
            {lang.locPoi}
          </TextCard>
          <div className={styles.Location__Row__Items}>
            {
              (POIs != undefined) &&
              POIs.map((poi, i) => {
                return(
                  <TextCard
                    key={i}
                    title={poi.title}
                    customTitleClass={styles.Location__Title_Tertiary}
                    customBodyClass={styles.Location__Body_Tertiary}
                    variant="contained"
                    shadowEnabled
                  >
                    {poi.description}
                    <span>{
                      poi.time.map((time, j) => {
                        return (
                          <p key={j}>{time}</p>
                        );
                      })
                    }</span>
                    <span>
                      <p>{`${lang.locAddress}: ${poi.address}`}</p>
                      <p>{`${lang.locDistance}: ${poi.distance}`}</p>
                    </span>
                    <div className={styles.Location__Buttons}>
                      <Button variant="text" target="_blank" link={poi.link} startIcon={<RiMapPin2Line />} endIcon={<RiExternalLinkFill/>}>{lang.locPOIOpen}</Button>
                    </div>
                  </TextCard>
                );
              })
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default Location;