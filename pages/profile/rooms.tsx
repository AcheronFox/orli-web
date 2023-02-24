import styles from "@/styles/pages/Profile.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";

type Props = {}

const Rooms: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();
  const { user } = useUser();

  if (!user) return (<div></div>)

  return (
    <div className={styles.Profile}>

    </div>
  )
}

export default Rooms;