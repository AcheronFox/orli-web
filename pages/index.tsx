import styles from "@/styles/pages/Home.module.scss"
import useTranslate from "@/hooks/translate/useTranslate";
import { NextPage } from "next";
import Image from "next/image";
import useIsMobile from "@/hooks/useIsMobile copy";
import ButtonGroup from "@/components/button/ButtonGroup";
import Button from "@/components/button/Button";
import { RiTelegramLine, RiInformationLine, RiChat4Fill, RiExternalLinkFill } from "react-icons/ri";
import { ReactCountryFlag } from "react-country-flag";

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  const { lang, changeLang, currLang } = useTranslate();
  const isMobile = useIsMobile()

  return (
    <>
      <Image
        src={isMobile? "/bg.png" : "/bg_desktop.png"}
        alt="Web Background"
        width="0"
        height="0"
        sizes="100vw"
        className={styles.Home__Bg}
      />
      <Image
        src={"/tiki.png"}
        alt="Tiki Statue"
        width="0"
        height="0"
        sizes={isMobile? "100vw" : "50vw"}
        className={styles.Home__Tiki}
      />
      <Image
        src={"/eye.png"}
        alt="Eyes"
        width="0"
        height="0"
        sizes={"10vw"}
        className={styles.Home__Eye}
      />
      <div className={styles.Home}>
        <section className={styles.Home__Title}>
          <div className={styles.Home__Title__Container}>
            <Image
              src={"/dusk.png"}
              alt="Dusk Logo"
              width="0"
              height="0"
              sizes={"150px"}
              className={styles.Home__Title__Dusk}
            />
            <h1>
              ÖRLI<br/>FÖRSZTIVÁL
            </h1>
            <h3>
              tiki fever
            </h3>
          </div>
        </section>
        <section className={styles.Home__Content}>
          <div>
            <div className={styles.Home__Content__Wide}>
              <span className={styles.Home__Styled}>Kia ora!</span>
              <button
                className={styles.Home__Content__Lang}
                onClick={() => changeLang(currLang == "en" ? "hu" : "en")}
              > 
                <ReactCountryFlag countryCode={ currLang == "hu"? "gb" : "hu" } svg />
              </button>
            </div><br /><br />
            <span>{lang.home1}</span><br />
            <span>{lang.home2}</span>
            <div className={styles.Home__Content__Buttons}>
              <ButtonGroup>
                <Button
                  link="https://t.me/orliforstivalHU"
                  variant="text"
                  target="_blank"
                  startIcon={<RiTelegramLine/>}
                  endIcon={<RiChat4Fill/>}
                >
                  {lang.homeChat}
                </Button>
                <Button
                  link="https://t.me/orliforsztival"
                  variant="text"
                  target="_blank"
                  startIcon={<RiTelegramLine/>}
                  endIcon={<RiInformationLine/>}
                >
                  Info
                </Button>
              </ButtonGroup>
            </div>
            <span>{lang.home3}</span><br />
            <span>{lang.home4}</span><br />
            <span className={styles.Home__Content__Buttons}>
              <Button
                link="https://www.orli.hu"
                variant="text"
                target="_blank"
                endIcon={<RiExternalLinkFill />}
              >
                {lang.homeWeb}
              </Button>
            </span>
            <span className={styles.Home__Styled}>Tēnā koe!</span>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home;