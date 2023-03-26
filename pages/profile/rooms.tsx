/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Rooms.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import Router from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import { IRoomStructure } from "@/models/room.model";
import axiosInstance from "@/utils/axiosConfig";
import RoomCard from "@/comp/RoomCard";
import { IAccomodation } from "@/models/accomodation.model";
import { IOccupant } from "@/models/occupant.model";
import CustomHead from "@/comp/CustomHead";

type Props = {}

const Rooms: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();

  const [rooms, setRooms] = useState<IRoomStructure>()
  const [accomodations, setAccomodations] = useState<IAccomodation[]>([])
  const [occupants, setOccupants] = useState<IOccupant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!didUserInit) return
    if (!user || (user && (!user.TicketKey || !user.isPaid))) {
      Router.push('/profile')
    }
    else if (user && user.TicketKey && user.isPaid) {
      getDefaults()
    }
  }, [didUserInit])


  // ===============================================
  // ROOMS
  // ===============================================
  const getDefaults = async () => {
    await axiosInstance.get<IRoomStructure>("api/room/")
    .then((res) => {
      setRooms(res.data)
    })
    .catch((err) => console.log(err))

    await axiosInstance.get<IAccomodation[]>("api/room/accomodations")
    .then((res) => {
      console.log(res.data)
      setAccomodations(res.data)
    })
    .catch((err) => console.log(err))

    await axiosInstance.get<IOccupant[]>("api/room/occupants")
    .then((res) => {
      console.log(res.data)
      setOccupants(res.data.sort((a, b) => Number(b.isRoomAdmin) - Number(a.isRoomAdmin)))
    })
    .catch((err) => console.log(err))
    setIsLoading(false)
  }

  return (
    <>
      <CustomHead title={t("navRooms")} />
      <LoadingOverlay isLoading={isLoading} />
      <div className={styles.Rooms}>
        {
          (user && rooms && accomodations) &&
          <div className={styles.Rooms__Content}>
            {
              Object.keys(rooms).map((building, i) => {
                const key = building

                return (
                  <section className={styles.Rooms__Section} key={i}>
                    <h2 className={styles.Rooms__Section__Title}>{key} {t("roomHouse")}</h2>
                    <div className={styles.Rooms__Section__Table}>
                      {
                        rooms[key].map((room, j) => {
                          return (
                            <RoomCard
                              key={j}
                              dbID={room.id}
                              roomNumber={room.roomNumber}
                              customName={room.customName}
                              maxSize={room.size}
                              currentAmount={accomodations.filter((o) => o.roomId == room.id).length}
                              occupants={occupants.filter((o) => o.roomId == room.id)}
                            />
                          );
                        })
                      }
                    </div>
                  </section>
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