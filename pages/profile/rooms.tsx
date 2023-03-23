/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Rooms.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import { useEffect, useState } from "react";
import Router from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import { IRoom, IRoomStructure } from "@/models/room.model";
import axiosInstance from "@/utils/axiosConfig";

type Props = {}

const Rooms: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();

  const [rooms, setRooms] = useState<IRoomStructure>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!didUserInit) return
    if (!user || (user && (!user.TicketKey || !user.isPaid))) {
      Router.push('/profile')
    }
  }, [didUserInit])

  useEffect(() => {
    if (user) {
      getDefaults()
    }
  }, [user])


  // ===============================================
  // ROOMS
  // ===============================================
  const getDefaults = async () => {
    await axiosInstance.get<IRoomStructure>("api/room/")
    .then((res) => {
      console.log(res.data)
      setRooms(res.data)
    })
    .catch((err) => console.log(err))
    setIsLoading(false)
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className={styles.Rooms}>
        {
          (user && rooms) &&
          <div className={styles.Rooms__Content}>
            {
              Object.keys(rooms).map((building, i) => {
                const key = building

                return (
                  <span key={i}>
                    {key}
                    <div>
                      {
                        rooms[key].map((room, j) => {
                          return (
                            <span key={j}> | {room.roomNumber} |</span>
                            
                          );
                        })
                      }
                    </div>
                  </span>
                );
              })
            }
          </div>
        }
        
      </div>
    </>
  )
}

export default Rooms;