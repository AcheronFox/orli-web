/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Admin.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import Router from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import CustomHead from "@/comp/CustomHead";
import axiosInstance from "@/utils/axiosConfig";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PrimaryButton from "@/comp/PrimaryButton";
import { INationalityCount } from "@/models/nationality-count.model";
import getNationality from "@/root/functions/getNationality";
import { IAdminChart } from "@/models/admin.model";
import _ from "lodash";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {}

const Admin: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();

  const [verifiedChartData, setVerifiedChartData] = useState<any>()
  const [paidChartData, setPaidChartData] = useState<any>()
  const [ticketChartData, setTicketChartData] = useState<any>()
  const [participantData, setParticipantData] = useState<any>()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    if (!didUserInit) return
    if (!user || !user.isAdmin) {
      Router.push('/')
    }
    else if (user && user.isAdmin) {
      runAuth()
    }
  }, [didUserInit])

  // ===============================================
  // AUTHENTICATION
  // ===============================================
  const runAuth = async () => {
    await axiosInstance.get(`/api/admin/auth`)
    .then((res) => {
      setIsAuthenticated(res.data)
      getDefaults()
    })
    .catch((err) => {
      setIsAuthenticated(false)
      console.log(err)
      Router.push('/')
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  // ===============================================
  // DATA
  // ===============================================
  useEffect(() => {
    getDefaults()
  }, [locale, isAuthenTicated])

  const getDefaults = async () => {
    if (!isAuthenTicated) return
    await getChart()
    await getParticipants()
    setIsLoading(false)
  }

  const getChart = async () => {
    await axiosInstance.get<IAdminChart>(`/api/admin/chart`)
    .then((res) => {
      constructChartData(res.data.payment, 'payment')
      constructChartData(res.data.ticket, 'ticket')
      constructChartData(res.data.verified, 'verified')
    })
    .catch((err) => console.log(err))
  }

  const getParticipants = async () => {
    await axiosInstance.get<INationalityCount[]>("api/participants/chart")
    .then((res) => {
      constructChartData(res.data, 'part')
    })
    .catch((err) => console.log(err))
  }

  const constructChartData = (data: any[], type: string) => {
    if (!data) return
    let labels: string[] = []
    let datas: number[] = []
    let backgroundColor: string[] = []
    let borderColor: string[] = []

    data.forEach((item: any) => {
      const color = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`

      switch (type) {
        case 'part':
          const nationality = getNationality(item.nationality, locale)
          if (nationality) {            
            labels.push(nationality.name)
            datas.push(item.count)
            backgroundColor.push(`rgba(${color}, 0.2)`)
            borderColor.push(`rgba(${color}, 1)`)
          }
          break;
        case 'ticket':          
          labels.push(t(`ticket${item.ticketType}Title`))
          datas.push(item.count)
          backgroundColor.push(`rgba(${color}, 0.2)`)
          borderColor.push(`rgba(${color}, 1)`)
          break;
        case 'payment':
          if (!item.paymentMethod) return
          datas.push(item.count)
          if (item.isPaid) {
            switch (item.paymentMethod.toLowerCase()) {
              case 'mkb':
                  labels.push(item.paymentMethod)
                  backgroundColor.push('rgba(182, 4, 57, 0.2)')
                  borderColor.push('rgba(182, 4, 57, 1)')
                break;
              case 'paypal':
                  labels.push(item.paymentMethod)
                  backgroundColor.push('rgba(0, 48, 135, 0.2)')
                  borderColor.push('rgba(0, 48, 135, 1)')
                break;
              case 'revolut':
                  labels.push(item.paymentMethod)
                  backgroundColor.push('rgba(40, 151, 210, 0.2)')
                  borderColor.push('rgba(40, 151, 210, 1)')
                break;
              default:
                labels.push(t("adminPaid"))
                backgroundColor.push('rgba(0, 255, 0, 0.2)')
                borderColor.push('rgba(0, 255, 0, 1)')
                break;
            }
          }
          else {
            labels.push(t("adminNotPaid"))
            backgroundColor.push('rgba(255, 0, 0, 0.2)')
            borderColor.push('rgba(255, 0, 0, 1)')
          }
          break;
        case 'verified':          
          datas.push(item.count)
          if (item.isVerified) {
            labels.push(t("adminVerified"))
            backgroundColor.push('rgba(0, 255, 0, 0.2)')
            borderColor.push('rgba(0, 255, 0, 1)')
          }
          else {
            labels.push(t("adminUnverified"))
            backgroundColor.push('rgba(255, 0, 0, 0.2)')
            borderColor.push('rgba(255, 0, 0, 1)')
          }
          break;
        default:
          break;
      }      
    });

    switch (type) {
      case 'part':
        setParticipantData({
          labels: labels,
          datasets: [{
            label: t("partNationality"), data: datas, backgroundColor: backgroundColor, borderColor: borderColor
          }]
        });
        break;
      case 'ticket':
        setTicketChartData({
          labels: labels,
          datasets: [{
            label: t("ticketTicket"), data: datas, backgroundColor: backgroundColor, borderColor: borderColor
          }]
        });
        break;
      case 'payment':
        setPaidChartData({
          labels: labels,
          datasets: [{
            label: t("adminPaidChart"), data: datas, backgroundColor: backgroundColor, borderColor: borderColor
          }]
        });
        break;
      case 'verified':
        setVerifiedChartData({
          labels: labels,
          datasets: [{
            label: t("adminVerifiedChart"), data: datas, backgroundColor: backgroundColor, borderColor: borderColor
          }]
        });
        break;
      default:
        break;
    }
  }


  return (
    <>
      <CustomHead title={t("navAdmin")} />
      <LoadingOverlay isLoading={isLoading} />
      <div className={styles.Admin}>
        {
          (user && user.isAdmin && isAuthenTicated && participantData && verifiedChartData && paidChartData && ticketChartData) &&
          <>
            <div className={styles.Admin__Content}>
              <div className={styles.Admin__Content__Item}>
                <h2>{t("adminVerifiedChart")}</h2>
                <Doughnut className={styles.Admin__Content__Chart} data={verifiedChartData} />
                <div className={styles.Admin__Content__Lower}>
                  <h3>{`${t("adminTotal")}: ${_.sum(verifiedChartData.datasets[0].data)}`}</h3>
                </div>
              </div>

              <div className={styles.Admin__Content__Item}>
                <h2>{t("adminPaidChart")}</h2>
                <Doughnut className={styles.Admin__Content__Chart} data={paidChartData} />
                <div className={styles.Admin__Content__Lower}>
                  <h3>{`${t("adminTotal")}: ${_.sum(paidChartData.datasets[0].data)}`}</h3>
                </div>
              </div>

              <div className={styles.Admin__Content__Item}>
                <h2>{t("ticketTickets")}</h2>
                <Doughnut className={styles.Admin__Content__Chart} data={ticketChartData} />
                <div className={styles.Admin__Content__Lower}>
                  <h3>{`${t("adminTotal")}: ${_.sum(ticketChartData.datasets[0].data)}`}</h3>
                </div>
              </div>

              <div className={styles.Admin__Content__Item}>
                <h2>{t("partNationality")}</h2>
                <Doughnut className={styles.Admin__Content__Chart} data={participantData} />
                <div className={styles.Admin__Content__Lower}>
                  <h3>{`${t("adminTotal")}: ${_.sum(participantData.datasets[0].data)}`}</h3>
                </div>
              </div>
            </div>
            <div className={styles.Admin__Lower}>
              <PrimaryButton text={t("adminSearch")} link="/admin/search" />
            </div>
          </>
        }
      </div>
    </>
  )
}

export default Admin;