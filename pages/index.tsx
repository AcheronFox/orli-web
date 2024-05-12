import styles from "@/styles/pages/Home.module.scss"
import { NextPage } from "next";
import { RiArrowDownSLine, RiBrush2Line, RiQuestionLine } from "react-icons/ri"
import useTranslate from "@/hooks/translate/useTranslate";
import Button from "@/comp/button/Button";
import ButtonGroup from "@/comp/button/ButtonGroup";
import Link from "next/link";
import TextCard from "@/comp/TextCard";
import Picture from "@/comp/utils/Picture";
import useIsMobile from "@/hooks/utils/useIsMobile";

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  const { lang } = useTranslate();
  const isMobile = useIsMobile()

  return (
    <div>
      <section className={styles.Home}>
        <Picture
          alt={"Main art"}
          defaultSrc={isMobile?
            (
              process.env.NODE_ENV == "development"
              ?
              `main_phone.jpg`
              :
              `${process.env.DOMAIN_ROOT}main_phone.jpg`
            )
            :
            (
              process.env.NODE_ENV == "development"
              ?
              `main.jpg`
              :
              `${process.env.DOMAIN_ROOT}main.jpg`
            )
          }
          sizes={"100wv"}
          className={styles.Home__Background}
        />
        <div className={styles.Home__Text}>
          <div className={styles.Home__Title}>
            <h3>Örli Försztivál</h3>
          </div>
          <div className={styles.Home__Location}>
            {lang.homeLocation}
          </div>
          <div className={styles.Home__Date}>
            2024.06.12.-16.
          </div>
          <div className={styles.Home__Notif}>
            {
              /*
              <NoticeBoard
                title={lang.homeNotif}
                shadowEnabled
                type="error"
              >
                {parse(lang.homeNotifText)}
              </NoticeBoard>
              */
            }
          </div>
        </div>
        <Link className={styles.Home__Scroll} href="/#read_more">
          <RiArrowDownSLine />
        </Link>
      </section>
      <section className={styles.Home__Content} id="read_more">
        <div className={styles.Home__Wrapper}>
          <div className={styles.Home__Wrapper__Row}>
            <TextCard
              title="Örli Försztivál"
              icon={<RiQuestionLine />}
              variant="simple"
            >
              {lang.homeAbout1}<br /><br />
              {lang.homeAbout2}
            </TextCard>

            <TextCard
              title={lang.homeTheme}
              icon={<RiBrush2Line />}
              variant="simple"
              image={isMobile? undefined : {
                imgPath: "tiki.png",
                sizes: "(max-width: 1400px) 50vw, 20vw",
                alt: "Tiki Statue"
              }}
              floatImage
              imagePlacement="right"
            >
              {lang.homeThemeDesc1}<br /><br />
              {lang.homeThemeDesc2}
            </TextCard>
          </div>

          <div className={styles.Home__Wrapper__Row}>
            <TextCard
              title={lang.homeNext}
              variant="simple"
            >
              {lang.homeText5}
              <div className={styles.Home__Btn}>
                <ButtonGroup>
                  <Button variant="outlined" link="/gallery/images">
                    {lang.homeBtnGallery}
                  </Button>
                  <Button variant="contained" link="/registration">
                    {lang.homeBtnReg}
                  </Button>
                  <Button variant="outlined" link="/location">
                    {lang.homeBtnLocation}
                  </Button>
                </ButtonGroup>
              </div>
            </TextCard>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;