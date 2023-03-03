/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Rooms.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import { useEffect } from "react";
import Router from "next/router";

type Props = {}

const Rooms: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();
  const { user, didUserInit } = useUser();

  useEffect(() => {
    if (!didUserInit) return
    if (!user) {
      Router.push('/')
    }
  }, [didUserInit])

  return (
    <div className={styles.Rooms}>
      {
        user &&
        <div className={styles.Rooms__Content}>
          
        </div>
      }
      
    </div>
  )
}

export default Rooms;