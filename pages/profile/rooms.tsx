/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Rooms.module.scss"
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { IRoom, IRoomStructure } from "@/models/room.model";
import axiosInstance from "@/functions/utils/axiosConfig";
import RoomCard from "@/comp/RoomCard";
import { IAccomodation } from "@/models/accomodation.model";
import { IOccupant } from "@/models/occupant.model";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import { RiTelegramLine, RiQuestionLine } from "react-icons/ri";
import { useClickOutside } from "@/hooks/utils/useClickOutside";
import { IJoinForm } from "@/models/join-form.model";
import { ILeaveForm } from "@/models/leave-form.model";
import createDatePatternFromDate from "@/functions/utils/createDatePattern";
import Button from "@/comp/button/Button";
import useTranslate from "@/hooks/translate/useTranslate";
import { useUser } from "@/hooks/user/useUser";
import useNotification from "@/hooks/notification/useNotification";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
const { io } = require("socket.io-client");
import { BarLoader } from "react-spinners";
import variables from "@/styles/abstracts/exports.module.scss"
import { Tooltip } from "react-tippy";
import Input from "@/comp/input/Input";
import Checkbox from "@/comp/input/Checkbox";
import ButtonGroup from "@/comp/button/ButtonGroup";
import Picture from "@/comp/utils/Picture";
let socket: any;


type Props = {}
export const isBrowser = typeof window !== "undefined";

const Rooms: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate();
  const { user, didUserInit } = useUser();
  const { addNotification, closeNotification } = useNotification();
  const overlayRef = useRef<any>()
  const joinRef = useRef<any>()
  const leaveRef = useRef<any>()

  useClickOutside(overlayRef, () => {
    setOverlayData(undefined)
  })
  useClickOutside(joinRef, () => {
    setJoinData(undefined)
  })
  useClickOutside(leaveRef, () => {
    setLeaveData(undefined)
  })

  const [rooms, setRooms] = useState<IRoomStructure>()
  const [accomodations, setAccomodations] = useState<IAccomodation[]>([])
  const [occupants, setOccupants] = useState<IOccupant[]>([])
  const [currentUserOccupant, setCurrentUserOccupant] = useState<IOccupant>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [overlayData, setOverlayData] = useState<IOccupant>()
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [joinData, setJoinData] = useState<IRoom>()
  const [showJoin, setShowJoin] = useState<boolean>(false)
  const [leaveData, setLeaveData] = useState<IRoom>()
  const [showLeave, setShowLeave] = useState<boolean>(false)
  const [shouldLock, setShouldLock] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const [roomPin, setRoomPin] = useState<string>('')
  const [customName, setCustomName] = useState<string>('')
  const [telegram, setTelegram] = useState<string>('')

  const [errorStates, setErrorStates] = useState<any>({
    pin: '',
    custonName: '',
    telegram: ''
  })

  let timer: NodeJS.Timeout | undefined = undefined;
  let time = 0;
  let message: string | undefined = undefined;
  let abortController = new AbortController();

  useEffect(() => {
    if (!didUserInit) return
    if (!user || (user && (!user.ticket || !user.ticket.isPaid || !(user.ticket.type == "WACC")))) {
      Router.push('/profile')
    }
    else if (user && user.ticket && user.ticket.isPaid && user.ticket.type == "WACC") {
      socketInitializer()
      getDefaults()
    }
  }, [didUserInit])



  // ===============================================
  // WEBSOCKET
  // ===============================================
  const socketInitializer = async () => {
    await fetch(`/api/sockets/rooms`)
    socket = io()

    socket.on('update-room', async () => {
      await getDefaults()
    })
  }


  // ===============================================
  // ROOMS
  // ===============================================
  const getDefaults = async () => {
    abortController.abort();
    abortController = new AbortController();

    await axiosInstance.get<IRoomStructure>("api/room/", {signal: abortController.signal})
    .then((res) => {
      setRooms(res.data)
    })
    .catch((err) => {
      if (err.code == "ERR_CANCELED") return;
      else return
    });

    await axiosInstance.get<IAccomodation[]>("api/room/accomodations", {signal: abortController.signal})
    .then((res) => {
      setAccomodations(res.data)
    })
    .catch((err) => {
      if (err.code == "ERR_CANCELED") return;
      else return
    });

    await axiosInstance.get<IOccupant[]>("api/room/occupants", {signal: abortController.signal})
    .then((res) => {
      setOccupants(res.data.sort((a, b) => Number(b.isOwner) - Number(a.isOwner)))
      setCurrentUserOccupant(res.data.find((o) => o.id == user?.attendee?.id))
    })
    .catch((err) => {
      if (err.code == "ERR_CANCELED") return;
      else return
    });
    setIsLoading(false)
  }


  // ===============================================
  // MODAL
  // ===============================================
  useEffect(() => {
    if (overlayData) setShowOverlay(true)
    else setShowOverlay(false)
  }, [overlayData])

  useEffect(() => {
    if (leaveData) setShowLeave(true)
    else setShowLeave(false)
  }, [leaveData])

  useEffect(() => {
    setShouldLock(false)
    setRoomPin('')
    setCustomName('')
    setTelegram(currentUserOccupant?.ownerContact? currentUserOccupant.ownerContact : '')
    if (joinData) setShowJoin(true)
    else setShowJoin(false)
  }, [joinData])

  const isValidUrl = (urlString: string) => {
    try { 
      return Boolean(new URL(urlString)); 
    }
    catch(e){ 
      return false; 
    }
  }

  const evalTelegram = () => {
    if (!overlayData) return;

    if (overlayData.ownerContact && isValidUrl(overlayData.ownerContact)) {
      return (
        <span className={styles.Modal__Header__Title_inline}><span>{`${lang.roomTelegram}: `}</span><Button startIcon={<RiTelegramLine />} link={overlayData.ownerContact} >{overlayData.ownerContact}</Button></span>
      );
    }
    else if (overlayData.ownerContact) {
      return (
        `${lang.roomTelegram}: ${overlayData.ownerContact}`
      );
    }
    else {
      return (
        `${lang.roomTelegram}: ${lang.roomNoTelegram}`
      );
    }
  }

  // ===============================================
  // INPUTS
  // ===============================================
  useEffect(() => {
    if (errorStates.pin != "") validatePin()
  }, [roomPin]);
  useEffect(() => {
    if (errorStates.customName != "") validateCustomName()
  }, [customName]);
  useEffect(() => {
    if (errorStates.telegram != "") validateTelegram()
  }, [telegram]);
  useEffect(() => {
    errorStates.pin && validatePin()
    errorStates.customName && validateCustomName()
    errorStates.telegram && validateTelegram()
  }, [currLang])

  const updateState = (check: any, key: string, value: string) => {
    if (check) {
      setErrorStates((errorStates: any) => { return { ...errorStates, [key]: value } });
      return false;
    } else {
      setErrorStates((errorStates: any) => { return { ...errorStates, [key]: '' } });
      return true
    }
  }

  const validatePin = () => {
    if (!shouldLock) {
      updateState(true, "pin", '')
      return true
    }
    const isnum = /^\d+$/.test(roomPin.trim());
    return updateState(!isnum || (roomPin.trim().length > 4 || roomPin.trim().length < 4), "pin", lang.roomPINError)
  }
  const validateCustomName = () => {
    if (!customName) {
      updateState(true, "customName", '')
      return true
    }
    return updateState(customName.trim().length > 15, "customName", lang.roomCustomNameError)
  }
  const validateTelegram = (externalVal?: string) => {
    if (externalVal) {
      return updateState(!isValidUrl(externalVal.trim()), "telegram", lang.roomTelegramError)
    }

    if (!telegram) {
      updateState(true, "telegram", '')
      return true
    }

    if (telegram.includes('@')) {
      const linkTelegram = telegram.replace('@', 'https://t.me/')
      return updateState(!isValidUrl(linkTelegram.trim()), "telegram", lang.roomTelegramError)
    }
    else {
      return updateState(!isValidUrl(telegram.trim()), "telegram", lang.roomTelegramError)
    }
  }

  // ===============================================
  // BACKEND
  // ===============================================
  const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      time = time + 100;
      if (time >= 6000) showOverload();
    }, 100);
  };

  const showOverload = () => {
    clearInterval(timer);
    message = addNotification({
      autoClose: false,
      closable: false,
      type: "info",
      message: lang.warnOverload
    })
  };
  const closeOverload = () => {
    clearInterval(timer);
    closeNotification(message!)
  };

  const joinRoom = (room: IRoom) => {
    //Run bulk final check
    let modifiedTelegram = telegram;
    if (modifiedTelegram.includes('@')) {
      modifiedTelegram = telegram.replace('@', 'https://t.me/')
    }

    const finalCheck: boolean[] = []
    finalCheck.push(
      validateTelegram(modifiedTelegram),
      validateCustomName(),
      shouldLock? validatePin() : true,
    )

    const roomOccupants = accomodations.filter((o) => o.roomId == room.id).length

    if (finalCheck.includes(false) || isDisabled || roomOccupants >= room.size) {
      return;
    }
    setIsDisabled(true);

    startTimer();
    setIsLoading(true)
    message = undefined;

    const formData: IJoinForm = {
      pin: roomPin,
      customName: customName,
      telegram: modifiedTelegram,
      roomId: room.id,
      roomCount: roomOccupants,
    };

    setJoinData(undefined)

    axiosInstance
    .post("api/room/join", formData)
    .then(async () => {
      socket.emit('room-change')
      await getDefaults()
    })
    .catch((err) => {
      if (err.response.status) {
        switch(err.response.status) {
          case (409):
            addNotification({
              type: "error",
              message: lang.roomErrConflict
            })
            break;
          case (401):
            addNotification({
              type: "error",
              message: lang.roomBadPIN
            })
            break;
          default:
            addNotification({
              type: "error",
              message: lang.errDefault
            })
            break;
        }  
      } else {
        addNotification({
          type: "error",
          message: lang.errDefault
        })
      }
    })
    .finally(() => {
      if (timer) clearInterval(timer);
      time = 0;
      closeOverload();
      setIsLoading(false)
      setIsDisabled(false);
    });
  }

  const leaveRoom = (room: IRoom) => {
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);

    startTimer();
    setIsLoading(true)
    message = undefined;

    const roomOccupants = accomodations.filter((o) => o.roomId == room.id).length
    const formData: ILeaveForm = {
      roomId: room.id,
      roomCount: roomOccupants,
    };

    setLeaveData(undefined)

    axiosInstance
    .post("api/room/leave", formData)
    .then(async () => {
      socket.emit('room-change')
      addNotification({
        type: "success",
        message: currLang=='hu'? "Szoba elhagyva." : "Room left."
      })
      await getDefaults()
    })
    .catch((err) => {
      if (err.response.status) {
        switch(err.response.status) {
          case (409):
            addNotification({
              type: "error",
              message: lang.roomErrConflict
            })
            break;
          case (401):
            addNotification({
              type: "error",
              message: lang.roomBadPIN
            })
            break;
          default:
            addNotification({
              type: "error",
              message: lang.errDefault
            })
            break;
        }  
      } else {
        addNotification({
          type: "error",
          message: lang.errDefault
        })
      }
    })
    .finally(() => {
      if (timer) clearInterval(timer);
      time = 0;
      closeOverload();
      setIsLoading(false)
      setIsDisabled(false);
    });
  }

  return (
    <>
      <CustomHead title={lang.navRooms} />
      <LoadingOverlay isLoading={isLoading}>
        <BarLoader
          color={variables.secondaryColor}
        />
      </LoadingOverlay>
      <div className={styles.Rooms__Background} />
      {
        (showOverlay && overlayData) &&
        <div className={styles.Modal}>
          <section ref={overlayRef} className={styles.Modal__Header}>
            <div className={styles.Modal__Header__Picture}>
              <Picture
                  alt={"User Thumb"}
                  defaultSrc={
                    overlayData.pathToPictureFile? (
                      process.env.NODE_ENV == "development"
                      ?
                      `uploads/${overlayData.pathToPictureFile}`
                      :
                      `${process.env.DOMAIN_ROOT}uploads/${overlayData.pathToPictureFile}`
                    )
                    :
                    'Default_profile.jpg'
                  }
                  sizes={"20vw"}
              />
            </div>
            <div className={styles.Modal__Header__Content}>
              <div className={styles.Modal__Header__Top}>
                <div className={styles.Modal__Header__Title}>
                  <h2>
                    {overlayData.name}
                  </h2>
                  <h3>
                    {overlayData.species}
                  </h3>
                  <span className={styles.Modal__Header__Title_text}>
                    {`${lang.roomRegDate}: ${createDatePatternFromDate(new Date(overlayData.registeredAt))}`}
                  </span>
                  <span className={styles.Modal__Header__Title_text}>
                    {
                      evalTelegram()
                    }
                  </span>
                </div>
                { (overlayData.hasFursuit || overlayData.sponsorLevel && parseInt(overlayData.sponsorLevel) > 0) &&
                  <div className={styles.Modal__Header__Badges}>
                    {
                      overlayData.hasFursuit &&
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {lang.partSuiter}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                            <FursuiterIcon style={{"fill": variables.primaryColor}} />
                        </span>
                      </Tooltip>
                    }
                    {
                      (overlayData.sponsorLevel && parseInt(overlayData.sponsorLevel) > 0) &&
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {(parseInt(overlayData.sponsorLevel)==2)? lang.ticketSuperSponsor : lang.partSponsor}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                          <SponsorIcon style={{"fill": variables.primaryColor}} />
                        </span>
                      </Tooltip>
                    }
                  </div>
                }
              </div>
              <div className={styles.Modal__Header__Bottom}>
                <Button
                  type="error"
                  variant="outlined"
                  onClick={() => setOverlayData(undefined)}
                >
                  {lang.roomClose}
                </Button>
              </div>
            </div>
          </section>
        </div>
      }



      {
        (showJoin && joinData) &&
        <div className={styles.Modal}>
          <section ref={joinRef} className={styles.Modal__Join}>
            <div className={styles.Modal__Join__Content}>
              <div className={`${styles.Modal__Join__Title} ${!joinData.customName && styles.Modal__Join__Title_small}`}>
                <h3>
                    {joinData.customName? (joinData.customName) : (lang.roomRoom)}
                </h3>
              </div>
              <div className={`${styles.Modal__Join__Title} ${joinData.customName && styles.Modal__Join__Title_small}`}>
                  <h3>
                      {joinData.number}
                  </h3>
              </div>
              <div>
                {
                  (joinData.hasRoomPin == true && accomodations.filter((o) => o.roomId == joinData.id).length > 0) &&
                  <span>
                    <span className={styles.Modal__Join__Inline}>
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {lang.roomLockQuestion2}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tooltip>
                      <Input
                        label={`${lang.roomPIN}:`}
                        id={"inp-1"}
                        type={"password"}
                        maxLength={4}
                        value={roomPin}
                        onChange={(e) => setRoomPin(e)}
                        error={errorStates.pin}
                      />
                    </span>
                    <p className={styles.Modal__Join__Error__Text}>{errorStates.pin}</p>
                  </span>
                }
                {
                  (joinData.hasRoomPin == false && accomodations.filter((o) => o.roomId == joinData.id).length == 0) &&
                  <span>
                    <span className={styles.Modal__Join__Inline}>
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {lang.roomLockQuestion}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tooltip>
                      <Checkbox
                        id="chk-1"
                        label={lang.roomLock}
                        checkBoxValue={shouldLock}
                        checked={(e) => {
                          setShouldLock(e)
                          setRoomPin('')
                          updateState(true, 'pin', '')
                        }}
                      />
                    </span>
                    {
                      shouldLock &&
                      <span>
                        <Input
                          id={"inp-2"}
                          label={`${lang.roomPIN}:`}
                          type={"password"}
                          maxLength={4}
                          value={roomPin}
                          onChange={(e) => setRoomPin(e)}
                          onBlur={() => validatePin()}
                          error={errorStates.pin}
                        />
                        <p className={styles.Modal__Join__Error__Text}>{errorStates.pin}</p>
                      </span>
                    }
                    <span className={styles.Modal__Join__Inline}>
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {lang.roomCustomQuestion}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tooltip>
                      <Input
                        id={"inp-3"}
                        label={`${lang.roomCustom} (${lang.roomOptional}):`}
                        maxLength={15}
                        value={customName}
                        onChange={(e) => setCustomName(e)}
                        onBlur={() => validateCustomName()}
                        error={errorStates.customName}
                      />
                    </span>
                    <p className={styles.Modal__Join__Error__Text}> {errorStates.customName}</p>
                  </span>
                }
                <span className={styles.Modal__Join__Inline}>
                  <Tooltip
                    html={
                      <span style={{ fontSize: "1.4rem" }}>
                        {lang.roomTelegramQuestion}
                      </span>
                    }
                    arrow
                    arrowSize="big"
                    size="big"
                    inertia
                    style={{
                      fontSize: '1.6rem'
                    }}
                  >
                    <span>
                      <RiQuestionLine size={20} />
                    </span>
                  </Tooltip>
                  <Input
                    label={`${lang.roomTelegram} (${lang.roomOptional}):`}
                    id={"inp-4"}
                    maxLength={100}
                    value={telegram}
                    onChange={(e) => setTelegram(e)}
                    onBlur={() => validateTelegram()}
                    error={errorStates.telegram}
                  />
                </span>
                <p className={styles.Modal__Join__Error__Text}> {errorStates.telegram}</p>
              </div>
              <div className={styles.Modal__Join__Bottom}>
                <ButtonGroup>
                  <Button
                    type="error"
                    variant="outlined"
                    onClick={() => setJoinData(undefined)}
                  >
                    {lang.roomCancel}
                  </Button>
                  <Button
                    type="success"
                    variant="outlined"
                    onClick={() => joinRoom(joinData)}
                    disabled={joinData.hasRoomPin && !roomPin}
                  >
                    {lang.roomJoin}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </section>
        </div>
      }



      {
        (showLeave && leaveData) &&
        <div className={styles.Modal}>
          <section ref={leaveRef} className={styles.Modal__Join}>
            <div className={styles.Modal__Join__Content}>
              <div className={`${styles.Modal__Join__Title} ${!leaveData.customName && styles.Modal__Join__Title_small}`}>
                <h3>
                    {leaveData.customName? (leaveData.customName) : (lang.roomRoom)}
                </h3>
              </div>
              <div className={`${styles.Modal__Join__Title} ${leaveData.customName && styles.Modal__Join__Title_small}`}>
                  <h3>
                      {leaveData.number}
                  </h3>
              </div>
              <div>
                <p>{lang.roomLeaveAsk}</p>
              </div>
              <div className={styles.Modal__Join__Bottom}>
                <ButtonGroup>
                  <Button
                    type="error"
                    variant="outlined"
                    onClick={() => setLeaveData(undefined)}
                  >
                    {lang.roomCancel}
                  </Button>
                  <Button
                    type="success"
                    variant="outlined"
                    onClick={() => leaveRoom(leaveData)}
                  >
                    {lang.roomLeave}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </section>
        </div>
      }



      <div className={styles.Rooms}>
        {
          (user && rooms && accomodations) &&
          <div className={styles.Rooms__Content}>
            <span>
              {lang.roomIntro1}<br /><br />
              {lang.roomIntro2}<br />
              <ul className={styles.Rooms__Content__List}>
                {
                  (lang.roomIntroList as unknown as Array<string>).map((val, i) => {
                    return (
                      <li key={i}>{val}</li>
                    );
                  })
                }
              </ul>
            </span>
            {
              Object.keys(rooms).map((building, i) => {
                const key = building

                return (
                  <section className={styles.Rooms__Section} key={i}>
                    <h2 className={styles.Rooms__Section__Title}>{key} {lang.roomHouse}</h2>
                    <div className={styles.Rooms__Section__Table}>
                      {
                        rooms[key].map((room, j) => {
                          return (
                            <RoomCard
                              key={j}
                              room={room}
                              maxSize={room.size}
                              currentAmount={accomodations.filter((o) => o.roomId == room.id).length}
                              occupants={occupants.filter((o) => o.roomId == room.id)}
                              clickRow={(e: IOccupant) => setOverlayData(e)}
                              clickButton={(e: IRoom) => setJoinData(e)}
                              clickLeave={(e: IRoom) => setLeaveData(e)}
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