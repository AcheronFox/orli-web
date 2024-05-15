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
import useTranslate from "@/hooks/translate/useTranslate";
import { INationality } from "@/models/newDbModels/nationality.model";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import { BarLoader } from "react-spinners";
import variables from "@/styles/abstracts/exports.module.scss"

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

const Row = ({index, participants, size, nationalities}: any) => {
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
      //setParticipants(res.data)
      setParticipants([
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
        {"nationalityId":4,"name":"teste","species":"test","pathToPictureFile":"34f8f80b1313cfef41bfa81b1c1d6ac8_test/test.jpg","hasFursuit":1,"sponsorLevel":"Regular"},
      ])
    })
    .catch((err) => {return})
    .finally(() => setIsLoading(false))
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
            { (participants != undefined) &&
              participants.map((item, i) => {
                return(
                  <Row
                    key={i}
                    index={i}
                    participants={participants}
                    size={size}
                    nationalities={nationalities}
                  />
                )
              })
            }
          </div>
        }
      </div>
    </>
  )
}

export default Participants;