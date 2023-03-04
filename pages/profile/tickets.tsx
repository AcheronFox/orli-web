/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Tickets.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import { useEffect, useState } from "react";
import Router from "next/router";
import PriceCard from "@/comp/PriceCard";
import Calendar from 'react-calendar'

type Props = {}

const Tickets: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();
  const [selectedTicket, setSelectedTicket] = useState<number>()
  const [wantsDay0, setWantsDay0] = useState<boolean>(false)
  const [wantsDayExtra, setWantsDayExtra] = useState<boolean>(false)
  const [maxDate, setMaxDate] = useState<Date>(new Date(2023, 5, 18)) 

  useEffect(() => {
    if (!didUserInit) return
    if (!user) {
      Router.push('/')
    }
  }, [didUserInit])

  const selectTicket = (ticket: number) => {
    setSelectedTicket(ticket)
    switch(ticket) {
      case 0:
        setWantsDay0(false)
        setWantsDayExtra(false)
        break;
      case 1:
        setWantsDay0(false)
        setWantsDayExtra(false)
        break;
      case 2:

        break;
    }
  }

  return (
    <div className={styles.Tickets}>
      {
        user &&
        <> 
          <div className={styles.Tickets__Content}>
            <section className={styles.Tickets__Prices}>
              <h2 className={styles.Tickets__Prices__Title}>{t("ticketTickets")}</h2>
              <div className={styles.Tickets__Prices__List}>
                <PriceCard
                title={t("ticket0Title")}
                customClass={selectedTicket==0? styles.Tickets__Selected : ''}
                button={<SecondaryButton disabled={selectedTicket==0} text={t("ticketSelect")} onClick={() => selectTicket(0)} />}
                description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                price={"100"} />

                <PriceCard
                title={t("ticket1Title")}
                customClass={selectedTicket==1? styles.Tickets__Selected : ''}
                button={<SecondaryButton disabled={selectedTicket==1} text={t("ticketSelect")} onClick={() => selectTicket(1)} />}
                description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                price={"100"} />

                <PriceCard
                title={t("ticket2Title")}
                customClass={selectedTicket==2? styles.Tickets__Selected : ''}
                button={<SecondaryButton disabled={selectedTicket==2} text={t("ticketSelect")} onClick={() => selectTicket(2)} />}
                description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                price={"100"} />
              </div>
            </section>
          </div>
          {
            (selectedTicket==2) &&
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{t("ticketExtra")}</h2>
                <div className={styles.Tickets__Prices__List}>
                  <PriceCard
                  title={t("ticketExtra0")}
                  customClass={wantsDay0? styles.Tickets__Selected : ''}
                  button={<SecondaryButton text={wantsDay0? t("ticketCancel") : t("ticketSelect")} onClick={() => setWantsDay0((o) => !o)} />}
                  description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                  price={"100"} />

                  <PriceCard
                  title={t("ticketExtra1")}
                  customClass={wantsDayExtra? styles.Tickets__Selected : ''}
                  button={<SecondaryButton text={wantsDayExtra? t("ticketCancel") : t("ticketSelect")} onClick={() => setWantsDayExtra((o) => !o)} />}
                  description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                  price={"100"} />
                </div>
              </section>
            </div>
          }
          {
          (selectedTicket==0 || selectedTicket==1) &&
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__DaySelect}>
                <h2>{t("ticketDaySelect")}</h2>
                <div>
                  <Calendar
                  locale={locale}
                  defaultActiveStartDate={new Date(2023, 5, 14)}
                  maxDate={maxDate}
                  minDate={new Date(2023, 5, 14)}
                  showNavigation={false}
                  selectRange={selectedTicket==1}
                  onClickDay={(e) => {
                    //TODO
                    const date = new Date(e.valueOf());
                    date.setDate(date.getDate() + 1);
                    setMaxDate(date)
                  }}
                  view={"month"}
                  />
                </div>
              </section>
            </div>
          }
        </>
      }
      
    </div>
  )
}

export default Tickets;