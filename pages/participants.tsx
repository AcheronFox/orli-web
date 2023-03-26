/* eslint-disable react-hooks/exhaustive-deps */
import UseWindowDimensions from "@/hooks/useWindowDimensions";
import { IParticipant } from "@/models/participant.model";
import styles from "@/styles/pages/Participants.module.scss"
import axiosInstance from "@/utils/axiosConfig";
import { NextPage } from "next";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { VariableSizeList as List } from "react-window";
import { AutoSizerProps, WindowScroller as _WindowScroller } from "react-virtualized";
import ParticipantCard from "@/comp/ParticipantCard";
import Section from "@/comp/Section";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslate } from "@/hooks/useTranslate";
import { INationalityCount } from "@/models/nationality-count.model";
import LoadingOverlay from "@/comp/LoadingOverlay";
import getNationality from "functions/getNationality";
import CustomHead from "@/comp/CustomHead";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WindowScroller = _WindowScroller as unknown as FC<AutoSizerProps>;
type Props = {}

const Participants: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const [participants, setParticipants] = useState<IParticipant[]>([])
  const [participantCount, setParticipantCount] = useState<number>(0)
  const [suiterCount, setSuiterCount] = useState<number>(0)
  const [chartData, setChartData] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoading2, setIsLoading2] = useState<boolean>(true)
  const [rawChartData, setRawChartData] = useState<INationalityCount[]>([])
  const size = UseWindowDimensions()
  let didInit = false;

  const sizeMap = useRef<any>();
  const setSize = useCallback((index: any, size: any) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);

  const listRef = useRef<any>(null);
  const labels = [t("partNationality")];

  const [options, setOptions] = useState({
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
    if (size.width <= parseInt(styles.tinyDesktop)) {
      setOptions({
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
      setOptions({
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

  useEffect(() => {
    if (didInit) return
    didInit = true;
    getParticipants()
    getChartData()
  }, [])

  useEffect(() => {
    constructChartData()
  }, [locale])

  const getParticipants = () => {
    setIsLoading(true)
    axiosInstance.get<IParticipant[]>("api/participants/")
    .then((res) => {
      setParticipants(res.data)
      setParticipantCount(res.data.length)
      setSuiterCount(res.data.filter((o) => o.isFursuiter == true).length)
    })
    .catch((err) => console.log(err))
    .finally(() => setIsLoading(false))
  }

  const getChartData = () => {
    setIsLoading2(true)
    axiosInstance.get<INationalityCount[]>("api/participants/chart")
    .then((res) => {
      setRawChartData(res.data)
      constructChartData(res.data)
    })
    .catch((err) => console.log(err))
    .finally(() => setIsLoading2(false))
    
  }

  const constructChartData = (data = rawChartData) => {
    if (!data) return
    let tempArr: { label: string | undefined; data: number[]; }[] = []
      data.forEach((item) => {
        const nationality = getNationality(item.nationality, locale)

        if (nationality) {
          const tempObj = {
            label: nationality.name,
            data: [item.count],
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
          }
          tempArr.push(tempObj)
        }
      })

      const response = {
        labels,
        datasets: tempArr
      }
      setChartData(response)
  }

  const Row = ({index, setSize, windowWidth }: any) => {
    const items = [];
    let fromIndex = index * 3
    let toIndex = Math.min(fromIndex + 3, participants.length);

    if (size.width <= parseInt(styles.smallDesktop)) {
      fromIndex = index * 2;
      toIndex = Math.min(fromIndex + 2, participants.length);
    }

    if (size.width <= parseInt(styles.tinyDesktop)) {
      fromIndex = index * 2;
      toIndex = Math.min(fromIndex + 2, participants.length);
    }

    if (size.width <= parseInt(styles.phone)) {
      fromIndex = index * 1;
      toIndex = Math.min(fromIndex + 1, participants.length);
    }

    const rowRef = useRef<any>();

    for (let i = fromIndex; i < toIndex; i++) {
      items.push(
        <ParticipantCard key={i} name={participants[i].fursonaName} species={participants[i].fursonaSpecies} nationality={participants[i].nationality}
        isFursuiter={participants[i].isFursuiter? true : false} isSponsor={parseInt(participants[i].sponsorLevel) > 0} picture={participants[i].picture}
        isSuperSponsor={parseInt(participants[i].sponsorLevel) == 2}></ParticipantCard>
      )
    }

    useEffect(() => {
      const calc = rowRef.current.getBoundingClientRect().height? (rowRef.current.getBoundingClientRect().height+50) : 0
      setSize(index, calc);
    }, [setSize, index, windowWidth]);

    return (
      <div
        ref={rowRef}
        key={index}
        className={styles.Participants__Item}
      >
        {items}
      </div>
    );
  }
  
  const getSize = (index: number) => {
    //fallback
    if (!sizeMap.current) return 500
    return sizeMap.current[index]
  };

  const handleScroll = ({scrollTop}: any) => {
    if (listRef.current) {
      listRef.current.scrollTo(scrollTop);
    }
  }

  return (
    <> 
      <CustomHead title={t("navParticipants")} />
      <LoadingOverlay isLoading={isLoading || isLoading2} />
      <div className={styles.Participants}>
        <div className={styles.Participants__Title}>
          <h1>
            {t("navParticipants")}
          </h1>
        </div>
        <Section>
          <div className={styles.Participants__Counter}>
            <span>
              <h2 className={styles.Participants__Counter__Title}>
                {t("partCounterAll")}
              </h2>
              <span className={styles.Participants__Counter__Count}>
                <h3>
                  {participantCount}
                </h3>
              </span>
            </span>
            
            <span>
              <h2 className={styles.Participants__Counter__Title}>
                {t("partCounterSuit")}
              </h2>
              <span className={styles.Participants__Counter__Count}>
                <h3>
                  {suiterCount}
                </h3>
              </span>
            </span>
          </div>
          {
            chartData &&
            <div className={styles.Participants__Chart}>
              <Bar options={options} data={chartData} />
            </div>
          }
        </Section>
        <div className={styles.Participants__List}>
          <WindowScroller onScroll={handleScroll}>
            {() => <div />}
          </WindowScroller>
          { typeof window !== "undefined" && participants &&
            <List
            className={styles.Participants__List__Overwrite}
            itemCount={participants.length}
            itemSize={getSize}
            height={window.innerHeight}
            width={"100%"}
            ref={listRef}
            >
            {({ index, style }) => (
              <div
                style={style}
              >
                <Row
                index={index}
                setSize={setSize}
                windowWidth={size.width}
                />
            </div>
            )}
          </List>
          }
        </div>
      </div>
    </>
  )
}

export default Participants;