import { NextPage } from "next";
import styles from "@/styles/pages/Home.module.scss"
import SocialMediaButton from "@/comp/SocialMediaButton";
import { RiTelegramLine, RiNotification3Line, RiDiscussLine } from 'react-icons/ri';

type Props = {}

const Home: NextPage<Props> = (props: Props) => {
  return (
    <div className={styles.Home}>
      <div className={styles.Home__Item}>
        <h1>
          Chat With Us: 
        </h1>
        <SocialMediaButton link={"https://t.me/orliforstivalHU"} icon={<RiTelegramLine />} icon2={<RiDiscussLine />} label="Telegram Chat" />
      </div>
      <div className={styles.Home__Item}>
        <h1>
          Get The Latest Updates:
        </h1>
        <SocialMediaButton link={"https://t.me/orliforsztival"} icon={<RiTelegramLine />} icon2={<RiNotification3Line />} label="Telegram News Channel" />
      </div>
    </div>
  )
}

export default Home;