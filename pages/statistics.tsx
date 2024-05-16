/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "@/functions/utils/axiosConfig";
import useTranslate from "@/hooks/translate/useTranslate";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/Statistics.module.scss"
import variables from "@/styles/abstracts/exports.module.scss"
import UseWindowDimensions from "@/hooks/utils/useWindowDimensions";
import { INationality } from "@/models/newDbModels/nationality.model";
import { IBarChart } from "@/models/chart.model";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import { BarLoader } from "react-spinners";
import TextCard from "@/comp/TextCard";
import { Bar, Doughnut } from "react-chartjs-2";
import { IParticipant } from "@/models/participant.model";
import Color from "color";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


type Props = {}

const Statistics: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate()
  const size = UseWindowDimensions()
  const [rawBarChartData, setRawBarChartData] = useState<IBarChart>()
  const [participantData, setParticipantData] = useState<IParticipant[]>([])
  const [natBarChartData, setNatBarChartData] = useState<any>()
  const [ageBarChartData, setAgeBarChartData] = useState<any>()
  const [donutChartData, setDonutChartData] = useState<any>()
  const [nationalities, setNationalities] = useState<INationality[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getNationalities()
    getParticipants()
    getBarData()
  }, [])

  const getNationalities = () => {
    axiosInstance.get('api/v2/nationality')
    .then((res) => {
      setNationalities(res.data)
    }) 
  }

  const getParticipants = () => {
    axiosInstance.get<IParticipant[]>("api/participants/")
    .then((res) => {
      setParticipantData(res.data)
      constructDonutData(res.data)
    })
    .catch((err) => {return})
  }

  const [donutOptions] = useState({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  });

  const [barOptions, setBarOptions] = useState({
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false,
        },
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  });

  useEffect(() => {
    if (size.width <= parseInt(variables.tinyDesktop)) {
      setBarOptions({
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              display: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              display: false,
            },
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      })
    }
    else {
      setBarOptions({
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              display: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              display: true,
            },
          }
        },
        plugins: {
          legend: {
            display: false
          }
          
        }
      })
    }
  }, [size])

  const getBarData = () => {
    setIsLoading(true)
    axiosInstance.get<IBarChart>("api/participants/chart/bar")
    .then((res) => {
      setRawBarChartData(res.data)
      constructChartData(res.data)
    })
    .catch((err) => {return})
    .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    constructChartData()
    constructDonutData()
  }, [currLang, nationalities, participantData, rawBarChartData])

  const constructChartData = (data = rawBarChartData) => {
    if (!data) return
    let tempArrNat: { label: string | undefined; data: number[]; }[] = []
    let tempArrAge: { label: string | undefined; data: number[]; }[] = []

    //Nationality
    data.nationality.forEach((item) => {
      const nationalityRaw = nationalities.find((o) => o.id == item.nationalityId)
      const nationality = currLang=="hu"? nationalityRaw?.countryNameHungarian : nationalityRaw?.countryNameEnglish

      if (nationality) {
        const tempObj = {
          label: nationality,
          data: [item.natCount],
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        }
        tempArrNat.push(tempObj)
      }
    })
    setNatBarChartData({
      labels: [lang.partNationality],
      datasets: tempArrNat
    })


    //Age
    data.age.forEach((item) => {
      const tempObj = {
        label: item.age.toString(),
        data: [item.count],
        backgroundColor: `rgba(${255}, ${Math.floor((item.count * 0.1) * 255)}, ${Math.floor((item.count * 0.1) * 125)}, 0.5)`,
      }
      tempArrAge.push(tempObj)
    })
    setAgeBarChartData({
      labels: [lang.adminAge],
      datasets: tempArrAge
    })
  }

  const constructDonutData = (data = participantData) => {
    if (!data) return
    let tempArr: { label: string | undefined; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number; }[] = [];

    const primaryColor = new Color(variables.primaryColor)
    const secondaryColor = new Color(variables.secondaryColor)
    const white = new Color('#ffffff')

    tempArr.push(
      {
        label: `${lang.navParticipants}`,
        data: [
          data.filter((o) => o.sponsorLevel == "None").length,
          data.filter((o) => o.sponsorLevel == "Regular").length,
          data.filter((o) => o.sponsorLevel == "Super").length,
        ],
        backgroundColor: [
          `rgba(${white.red()}, ${white.green()}, ${white.blue()}, .5)`,
          `rgba(${secondaryColor.red()}, ${secondaryColor.green()}, ${secondaryColor.blue()}, .5)`,
          `rgba(${primaryColor.red()}, ${primaryColor.green()}, ${primaryColor.blue()}, .5)`,
        ],
        borderColor: [
          `rgba(${white.red()}, ${white.green()}, ${white.blue()}, .8)`,
          `rgba(${secondaryColor.red()}, ${secondaryColor.green()}, ${secondaryColor.blue()}, .8)`,
          `rgba(${primaryColor.red()}, ${primaryColor.green()}, ${primaryColor.blue()}, .8)`,
        ],
        borderWidth: 2,
      },
    )

    setDonutChartData({
      labels: [currLang=="hu"? "Nem Szponzor" : "Not Sponsor", lang.partSponsor, lang.ticketSuperSponsor],
      datasets: tempArr
    })
  }

  return (
    <>
      <CustomHead title={lang.navStatistics} />
      <LoadingOverlay isLoading={isLoading} >
        <BarLoader
          color={variables.secondaryColor}
        />
      </LoadingOverlay>
      <div className={styles.Statistics__Background} />
      <div className={styles.Statistics}>
        <TextCard
          title={lang.navStatistics}
          customTitleClass={styles.Statistics__Title}
          customBodyClass={styles.Statistics__Body}
          shadowEnabled
        >
          {
            donutChartData &&
            <div className={styles.Statistics__Chart_Donut}>
              <Doughnut options={donutOptions} data={donutChartData} />
            </div>
          }
          {
            natBarChartData &&
            <div className={styles.Statistics__Chart}>
              <Bar options={barOptions} data={natBarChartData} />
            </div>
          }
          {
            ageBarChartData &&
            <div className={styles.Statistics__Chart}>
              <Bar options={barOptions} data={ageBarChartData} />
            </div>
          }
          {
            (participantData) &&
            <>
              <div className={`${styles.Statistics__Counter} ${styles.Statistics__Counter_Border}`}>
                <span>
                  <h2 className={styles.Statistics__Counter__Title}>
                    {lang.partCounterAll}
                  </h2>
                  <span className={styles.Statistics__Counter__Count}>
                    <h3>
                      {participantData.length || 0}
                    </h3>
                  </span>
                </span>
                
                <span>
                  <h2 className={styles.Statistics__Counter__Title}>
                    {lang.partCounterSuit}
                  </h2>
                  <span className={styles.Statistics__Counter__Count}>
                    <h3>
                      {participantData.filter((o) => o.hasFursuit).length || 0}
                    </h3>
                  </span>
                </span>
              </div>
              <div className={styles.Statistics__Counter}>
                <span>
                  <h2 className={styles.Statistics__Counter__Title}>
                    {currLang=='hu'? "Suiterek Százaléka:" : "Percentage of Suiters:"}
                  </h2>
                  <span className={styles.Statistics__Counter__Count}>
                    <h3>
                      {`${((100 * (participantData.filter((o) => o.hasFursuit).length || 0)) / participantData.length).toFixed(2)}%`}
                    </h3>
                  </span>
                </span>
              </div>
            </>
          }
        </TextCard>
      </div>
    </>
  );
}
export default Statistics