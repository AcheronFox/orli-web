import PrimaryButton from "@/comp/PrimaryButton"
import Separator from "@/comp/Separator"
import styles from "@/styles/pages/Home.module.scss"
import { RiArrowDownSLine } from "react-icons/ri";
import { useTranslate } from "@/hooks/useTranslate";

export default function Home() {
  const { t } = useTranslate();

  return (
    <div>
      <section className={styles.Home}>
        <div className={styles.Home__TextField}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis facilis nobis dignissimos obcaecati voluptatem ad impedit ducimus, at voluptates? Id culpa itaque repellendus numquam magnam, odio est recusandae deserunt sapiente?
          <div className={styles.Home__TextField__Btn}>
            <PrimaryButton text={t("homeReg")} link="/registration"></PrimaryButton>
          </div>
        </div>
        <div className={styles.Home__Separator}>
          <Separator text={"Scroll Down"} placement={"both"} IconComp={<RiArrowDownSLine size={"100%"}/>}></Separator>
        </div>
      </section>
      <section>
        <iframe width="420" height="315"
          src="https://www.youtube.com/embed/tgbNymZ7vqY">
        </iframe> 
      </section>
    </div>
  )
}
