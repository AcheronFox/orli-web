/* eslint-disable react-hooks/exhaustive-deps */
import UseWindowDimensions from "@/hooks/utils/useWindowDimensions";
import { IParticipant } from "@/models/participant.model";
import styles from "@/styles/pages/Participants.module.scss"
import axiosInstance from "@/functions/utils/axiosConfig";
import { NextPage } from "next";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { VariableSizeList as List } from "react-window";
import { AutoSizerProps, WindowScroller as _WindowScroller } from "react-virtualized";
import ParticipantCard from "@/comp/ParticipantCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useTranslate from "@/hooks/translate/useTranslate";
import { INationality } from "@/models/newDbModels/nationality.model";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import { BarLoader } from "react-spinners";
import variables from "@/styles/abstracts/exports.module.scss"

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

const calculateIndex = (index: number, listLength: number, size: any) => {
  let fromIndex = index * 3
  let toIndex = Math.min(fromIndex + 3, listLength);

  if (size.width <= parseInt(styles.smallDesktop)) {
    fromIndex = index * 2;
    toIndex = Math.min(fromIndex + 2, listLength);
  }

  if (size.width <= parseInt(styles.tinyDesktop)) {
    fromIndex = index * 2;
    toIndex = Math.min(fromIndex + 2, listLength);
  }

  if (size.width <= parseInt(styles.phone)) {
    fromIndex = index;
    toIndex = Math.min(fromIndex + 1, listLength);
  }
  return {fromIndex, toIndex}
}

const Row = ({index, setSize, windowWidth, participants, size, nationalities}: any) => {
  const items = [];
  const {fromIndex, toIndex} = calculateIndex(index, participants.length, size)

  const rowRef = useRef<any>();

  for (let i = fromIndex; i < toIndex; i++) {
    items.push(
      <ParticipantCard key={i} name={participants[i].name} species={participants[i].species} nationality={participants[i].nationalityId}
                       isFursuiter={!!participants[i].hasFursuit} isSponsor={participants[i].sponsorLevel != "None"} picture={participants[i].pathToPictureFile}
                       isSuperSponsor={participants[i].sponsorLevel == "Super"} nationalities={nationalities}></ParticipantCard>
    )
  }

  useEffect(() => {
    const calc = (rowRef.current?.getBoundingClientRect().height? (rowRef.current.getBoundingClientRect().height+50) : 0)
    setSize(index, calc);
  }, [setSize, index, windowWidth]);

  if (!items.length) return null

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

const Participants: NextPage<Props> = (props: Props) => {
  const { lang } = useTranslate();
  const [participants, setParticipants] = useState<IParticipant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [nationalities, setNationalities] = useState<INationality[]>([])
  const size = UseWindowDimensions()
  const [didInit, setDidInit] = useState<boolean>(false);

  const sizeMap = useRef<any>();
  const setSize = useCallback((index: any, size: any) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);

  const listRef = useRef<any>(null);

  useEffect(() => {
    if (didInit) return
    setDidInit(true);
    getParticipants()
    getNationalities()
  }, [])

  const getNationalities = () => {
    axiosInstance.get('/api/v2/nationality/').then((res) => {
      setNationalities(res.data)
    })
  }

  const getParticipants = () => {
    setIsLoading(true)
    axiosInstance.get<IParticipant[]>("api/participants/")
    .then((res) => {
      setParticipants(res.data)
    })
    .catch((err) => {return})
    .finally(() => setIsLoading(false))
  }

  /*
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

  const getChartData = () => {
    setIsLoading2(true)
    axiosInstance.get<INationalityCount[]>("api/participants/chart")
    .then((res) => {
      setRawChartData(res.data)
      constructChartData(res.data)
    })
    .catch((err) => {return})
    .finally(() => setIsLoading2(false))
  }

  useEffect(() => {
    constructChartData()
  }, [currLang])


  const constructChartData = (data = rawChartData) => {
    if (!data) return
    let tempArr: { label: string | undefined; data: number[]; }[] = []
      data.forEach((item) => {
        const nationalityRaw = nationalities.find((o) => o.id == item.nationality)
        const nationality = currLang=="hu"? nationalityRaw?.countryNameHungarian : nationalityRaw?.countryNameEnglish

        if (nationality) {
          const tempObj = {
            label: nationality,
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
  */
  
  const getSize = (index: number) => {
    //fallback
    if (!sizeMap.current) return 500
    return sizeMap.current[index]? sizeMap.current[index] : null
  };

  const handleScroll = ({scrollTop}: any) => {
    if (listRef.current) {
      listRef.current.scrollTo(scrollTop);
    }
  }

  return (
    <> 
      <CustomHead title={lang.navParticipants} />
      <LoadingOverlay isLoading={isLoading} >
        <BarLoader
          color={variables.secondaryColor}
        />
      </LoadingOverlay>
      <div className={styles.Participants__Background} />
      <div className={styles.Participants}>
        { (didInit) &&
          <div className={styles.Participants__List}>
            <WindowScroller onScroll={handleScroll}>
              {() => <div />}
            </WindowScroller>
            { participants &&
              <List
              className={styles.Participants__List__Overwrite}
              itemCount={participants.length}
              itemSize={getSize}
              height={window.innerHeight}
              width={"100%"}
              ref={listRef}
              >
              {({ index, style }) => {
                return (
                  <div
                    style={style}
                    key={index}
                  >
                    <Row
                    index={index}
                    setSize={setSize}
                    windowWidth={size.width}
                    participants={participants}
                    size={size}
                    nationalities={nationalities}
                    />
                  </div>
                )
              }}
            </List>
            }
          </div>
        }
      </div>
    </>
  )
}

export default Participants;