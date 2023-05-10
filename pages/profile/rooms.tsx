/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Rooms.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { useContext, useEffect, useRef, useState } from "react";
import Router from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import { IRoom, IRoomStructure } from "@/models/room.model";
import axiosInstance from "@/utils/axiosConfig";
import RoomCard from "@/comp/RoomCard";
import { IAccomodation } from "@/models/accomodation.model";
import { IOccupant } from "@/models/occupant.model";
import CustomHead from "@/comp/CustomHead";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import LinkButton from "@/comp/LinkButton";
import { RiTelegramLine, RiQuestionLine } from "react-icons/ri";
import { useClickOutside } from "@/hooks/useClickOutside";
import Input from "@/comp/Input";
import { IJoinForm } from "@/models/join-form.model";
import { ILeaveForm } from "@/models/leave-form.model";
import createDatePatternFromDate from "@/root/functions/createDatePattern";
import CustomBackground from "@/comp/CustomBackground";
const { io } = require("socket.io-client");
let socket: any;


type Props = {}
export const isBrowser = typeof window !== "undefined";

const Rooms: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();
  const { HandleClose, AddFloatingMessage } = useContext(FloatingMessageContext);
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
  let message: number | undefined = undefined;
  let abortController = new AbortController();

  useEffect(() => {
    if (!didUserInit) return
    if (!user || (user && (!user.TicketKey || !user.isPaid || user.ticketType !== '2'))) {
      Router.push('/profile')
    }
    else if (user && user.TicketKey && user.isPaid && user.ticketType === '2') {
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
      setOccupants(res.data.sort((a, b) => Number(b.isRoomAdmin) - Number(a.isRoomAdmin)))
      setCurrentUserOccupant(res.data.find((o) => o.AccountKey == user?.AccountKey))
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
    setTelegram(currentUserOccupant?.telegram? currentUserOccupant.telegram : '')
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

    if (overlayData.telegram && isValidUrl(overlayData.telegram)) {
      return (
        <span className={styles.Modal__Header__Title_inline}><span>{`${t("roomTelegram")}: `}</span><LinkButton text={overlayData.telegram} icon={<RiTelegramLine />} link={overlayData.telegram} /></span>
      );
    }
    else if (overlayData.telegram) {
      return (
        `${t("roomTelegram")}: ${overlayData.telegram}`
      );
    }
    else {
      return (
        `${t("roomTelegram")}: ${t("roomNoTelegram")}`
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
  }, [locale])

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
    return updateState(!isnum || (roomPin.trim().length > 4 || roomPin.trim().length < 4), "pin", t("roomPINError"))
  }
  const validateCustomName = () => {
    if (!customName) {
      updateState(true, "customName", '')
      return true
    }
    return updateState(customName.trim().length > 15, "customName", t("roomCustomNameError"))
  }
  const validateTelegram = (externalVal?: string) => {
    if (externalVal) {
      return updateState(!isValidUrl(externalVal.trim()), "telegram", t("roomTelegramError"))
    }

    if (!telegram) {
      updateState(true, "telegram", '')
      return true
    }

    if (telegram.includes('@')) {
      const linkTelegram = telegram.replace('@', 'https://t.me/')
      return updateState(!isValidUrl(linkTelegram.trim()), "telegram", t("roomTelegramError"))
    }
    else {
      return updateState(!isValidUrl(telegram.trim()), "telegram", t("roomTelegramError"))
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
    message = AddFloatingMessage({"autocloses": false, "closable": false, "type": "Info", "message": t("warnOverload")})
  };
  const closeOverload = () => {
    clearInterval(timer);
    HandleClose(message!)
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
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("roomErrConflict")})
            break;
          case (400):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errBadRequest")})
            break;
          case (401):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("roomBadPIN")})
            break;
          default:
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errDefault")})
            break;
        }  
      } else {
        AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errDefault")})
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
      await getDefaults()
    })
    .catch((err) => {
      if (err.response.status) {
        switch(err.response.status) {
          case (409):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("roomErrConflict")})
            break;
          case (400):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errBadRequest")})
            break;
          case (401):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("roomBadPIN")})
            break;
          default:
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errDefault")})
            break;
        }  
      } else {
        AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errDefault")})
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
      <CustomHead title={t("navRooms")} />
      <LoadingOverlay isLoading={isLoading} />
      <CustomBackground />
      {
        (showOverlay && overlayData) &&
        <div className={styles.Modal}>
          <section ref={overlayRef} className={styles.Modal__Header}>
            <div className={styles.Modal__Header__Picture}>
              <picture>
                <source srcSet={`${overlayData.picture? (`/uploads/${overlayData.picture.split('.')[0]}_x1.${overlayData.picture.split('.')[1]} 1x, /uploads/${overlayData.picture.split('.')[0]}_x2.${overlayData.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                <img srcSet={`${overlayData.picture? (`/uploads/${overlayData.picture.split('.')[0]}_x1.${overlayData.picture.split('.')[1]} 1x, /uploads/${overlayData.picture.split('.')[0]}_x2.${overlayData.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} alt="User Picture" src="/Default_profile_x2.jpg" loading="lazy" />
              </picture>
            </div>
            <div className={styles.Modal__Header__Content}>
              <div className={styles.Modal__Header__Top}>
                <div className={styles.Modal__Header__Title}>
                  <h2>
                    {overlayData.fursonaName}
                  </h2>
                  <h3>
                    {overlayData.fursonaSpecies}
                  </h3>
                  <span className={styles.Modal__Header__Title_text}>
                    {`${t("roomRegDate")}: ${createDatePatternFromDate(new Date(overlayData.registeredAt))}`}
                  </span>
                  <span className={styles.Modal__Header__Title_text}>
                    {
                      evalTelegram()
                    }
                  </span>
                </div>
                { (overlayData.isFursuiter == true || overlayData.sponsorLevel && parseInt(overlayData.sponsorLevel) > 0) &&
                  <div className={styles.Modal__Header__Badges}>
                    {
                      (overlayData.isFursuiter == true) &&
                      <Tippy className={styles.Tooltip} content={t("partSuiter")}>
                          <span>
                              <FursuiterIcon style={{"fill": "#F741D5"}} />
                          </span>
                      </Tippy>
                    }
                    {
                      (overlayData.sponsorLevel && parseInt(overlayData.sponsorLevel) > 0) &&
                      <Tippy className={styles.Tooltip} content={(parseInt(overlayData.sponsorLevel)==2)? t("ticketSuperSponsor") : t("partSponsor")}>
                          <span>
                              <SponsorIcon style={{"fill": "#F741D5"}} />
                          </span>
                      </Tippy>
                    }
                  </div>
                }
              </div>
              <div className={styles.Modal__Header__Bottom}>
                <SecondaryButton text={t("roomClose")} classType={"danger"} onClick={() => setOverlayData(undefined)}/>
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
                    {joinData.customName? (joinData.customName) : (t("roomRoom"))}
                </h3>
              </div>
              <div className={`${styles.Modal__Join__Title} ${joinData.customName && styles.Modal__Join__Title_small}`}>
                  <h3>
                      {joinData.roomNumber}
                  </h3>
              </div>
              <div>
                {
                  (joinData.hasRoomPin == true && accomodations.filter((o) => o.roomId == joinData.id).length > 0) &&
                  <span>
                    <span className={styles.Modal__Join__Inline}>
                      <Tippy content={t("roomLockQuestion2")}>
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tippy>
                      <Input
                        label={`${t("roomPIN")}:`}
                        placeholder={t("roomPIN")}
                        id={"inp-1"}
                        type={"password"}
                        maxlength={4}
                        value={roomPin}
                        onChange={(e) => setRoomPin(e.target.value)}
                        inputClass={errorStates.pin && styles.Modal__Join__Error}
                      />
                    </span>
                    <p className={styles.Modal__Join__Error__Text}>{errorStates.pin}</p>
                  </span>
                }
                {
                  (joinData.hasRoomPin == false && accomodations.filter((o) => o.roomId == joinData.id).length == 0) &&
                  <span>
                    <span className={styles.Modal__Join__Inline}>
                      <Tippy content={t("roomLockQuestion")}>
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tippy>
                      <Input
                        type="checkbox"
                        label={t("roomLock")}
                        id={"chk-1"}
                        checked={(e) => {
                          setShouldLock(e)
                          setRoomPin('')
                          updateState(true, "pin", '')
                        }}
                      />
                    </span>
                    {
                      (shouldLock == true) &&
                      <span>
                        <Input
                          id={"inp-2"}
                          label={`${t("roomPIN")}:`}
                          placeholder={t("roomPIN")}
                          type={"password"}
                          maxlength={4}
                          value={roomPin}
                          onChange={(e) => setRoomPin(e.target.value)}
                          onBlur={() => validatePin()}
                          inputClass={errorStates.pin && styles.Modal__Join__Error}
                        />
                        <p className={styles.Modal__Join__Error__Text}>{errorStates.pin}</p>
                      </span>
                    }
                    <span className={styles.Modal__Join__Inline}>
                      <Tippy content={t("roomCustomQuestion")}>
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tippy>
                      <Input
                        id={"inp-3"}
                        label={`${t("roomCustom")} (${t("roomOptional")}):`}
                        maxlength={15}
                        placeholder={`${t("roomCustom")} (${t("roomOptional")})`}
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        onBlur={() => validateCustomName()}
                        inputClass={errorStates.customName && styles.Modal__Join__Error}
                      />
                    </span>
                    <p className={styles.Modal__Join__Error__Text}> {errorStates.customName}</p>
                  </span>
                }
                <span className={styles.Modal__Join__Inline}>
                  <Tippy content={t("roomTelegramQuestion")}>
                    <span>
                      <RiQuestionLine size={20} />
                    </span>
                  </Tippy>
                  <Input
                    label={`${t("roomTelegram")} (${t("roomOptional")}):`}
                    placeholder={`${t("roomTelegram")} (${t("roomOptional")})`}
                    id={"inp-4"}
                    maxlength={100}
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    onBlur={() => validateTelegram()}
                    inputClass={errorStates.telegram && styles.Modal__Join__Error}
                  />
                </span>
                <p className={styles.Modal__Join__Error__Text}> {errorStates.telegram}</p>
              </div>
              <div className={styles.Modal__Join__Bottom}>
                <SecondaryButton text={t("roomCancel")} classType={"danger"} type='left' onClick={() => setJoinData(undefined)}/>
                <SecondaryButton disabled={joinData.hasRoomPin && !roomPin} text={t("roomJoin")} classType={"success"} type='right' onClick={() => joinRoom(joinData)}/>
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
                    {leaveData.customName? (leaveData.customName) : (t("roomRoom"))}
                </h3>
              </div>
              <div className={`${styles.Modal__Join__Title} ${leaveData.customName && styles.Modal__Join__Title_small}`}>
                  <h3>
                      {leaveData.roomNumber}
                  </h3>
              </div>
              <div>
                <p>{t("roomLeaveAsk")}</p>
              </div>
              <div className={styles.Modal__Join__Bottom}>
                <SecondaryButton text={t("roomCancel")} classType={"danger"} type='left' onClick={() => setLeaveData(undefined)}/>
                <SecondaryButton text={t("roomLeave")} classType={"success"} type='right' onClick={() => leaveRoom(leaveData)}/>
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
              {t("roomIntro1")}<br /><br />
              {t("roomIntro2")}<br />
              <ul className={styles.Rooms__Content__List}>
                {
                  (t("roomIntroList") as unknown as Array<string>).map((val, i) => {
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
                    <h2 className={styles.Rooms__Section__Title}>{key} {t("roomHouse")}</h2>
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