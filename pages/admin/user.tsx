/* eslint-disable react-hooks/exhaustive-deps */
/*
    import styles from "@/styles/pages/AdminUser.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { useContext, useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import CustomHead from "@/comp/CustomHead";
import axiosInstance from "@/functions/utils/axiosConfig";
import _ from "lodash";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import SecondaryButton from "@/comp/SecondaryButton";
import { useClickOutside } from "@/hooks/utils/useClickOutside";
import DropDown from "@/comp/DropDown";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import CustomBackground from "@/comp/CustomBackground";
import { IRoomRaw } from "@/models/room.model";
import FilterableDropDown from "@/comp/FilterableDropDown";


type Props = {}

const AdminUser: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();
    const { user, didUserInit } = useUser();
    const { AddFloatingMessage } = useContext(FloatingMessageContext);
    const routerQuery = useRouter()?.query

    const [userID, setUserID] = useState<number>()
    const [originalUser, setOriginalUser] = useState<any>()
    const [targetUser, setTargetUser] = useState<any>()
    const [remainingRooms, setRemainingRooms] = useState<IRoomRaw[]>()
    const [emailLimit, setEmailLimit] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [selected, setSelected] = useState<string>();

    const [showRevertModal, setShowRevertModal] = useState<boolean>(false)
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
    const revertRef = useRef<any>()
    const confirmRef = useRef<any>()

    const paymentMethods = [
        'MKB',
        'Paypal',
        'Revolut',
    ]

    useClickOutside(revertRef, () => {
        setShowRevertModal(false)
    })
    useClickOutside(confirmRef, () => {
        setShowConfirmModal(false)
    })

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
        if (routerQuery.id) setUserID(parseInt(routerQuery.id.toString()))
    }, [routerQuery])
    useEffect(() => {
        getDefaults()
    }, [userID])

    const getDefaults = async () => {
        if (!userID) return;
        setIsLoading(true)

        await axiosInstance.get(`/api/admin/user/${userID}`)
            .then((res) => {
                setTargetUser(res.data)
                setOriginalUser(res.data)
            })
            .catch((err) => {
                if (err.response && err.response.status == 404) {
                    Router.push('/admin/search')
                }
                else {
                    AddFloatingMessage({
                        autocloses: true,
                        type: "Error",
                        message: t("errDefault"),
                    });
                }
            })

        await axiosInstance.get("/api/admin/email-limit")
            .then((res) => {
                setEmailLimit(res.data)
            })
            .catch((err) => {
                return
            })

        await axiosInstance.get("/api/admin/rooms")
            .then((res) => {
                setRemainingRooms(res.data)
            })
            .catch((err) => {
                console.log(err)
            })

        setIsLoading(false)
    }

    const updateState = (state: any, key: string, value: any, key2?: string) => {
        state((val: any) => {
            if (key2) {
                let deepObj = {...val}[key]
                return { ...val, [key]: {
                    ...deepObj, [key2]: value
                } }
            } else {
                return { ...val, [key]: value }
            }
        });
    }

    useEffect(() => {
        if (!_.isEqual(originalUser, targetUser)) setShowConfirm(true)
        else setShowConfirm(false)
    }, [targetUser])


    // ===============================================
    // BACKEND
    // ===============================================
    const deepDiff = (a: any, b: any, r: any) => {
        _.each(a, (v, k) => {
            if (!b) r[k] = null
          if (r.hasOwnProperty(k) || (b[k] === v)) return;
          r[k] = _.isObject(v) ? diff(v, b[k]) : v;
        });
    }
    const diff = (a: any, b: any) => {
        let r = {};
        deepDiff(a, b, r);
        deepDiff(b, a, r);
        return r;
    }

    const updateUser = async () => {
        if (_.isEqual(originalUser, targetUser)) return
        setIsLoading(true)
        const payload = diff(targetUser, originalUser)

        await axiosInstance.post(`api/admin/user/update/${userID}`, payload)
        .then(() => {
            getDefaults()
        })
        .catch(() => {
            AddFloatingMessage({
                autocloses: true,
                type: "Error",
                message: t("errDefault"),
            });
        })
        .finally(() => {
            setIsLoading(false)
        })
    }


    return (
        <>
            {
                (userID!=undefined) &&
                <CustomHead title={`${t("adminUser")}: ${userID}`} />
            }
            <LoadingOverlay isLoading={isLoading} />
            <CustomBackground />
            <div className={styles.Admin}>
                {
                    (showRevertModal) &&
                    <div className={styles.Modal}>
                        <section ref={revertRef} className={styles.Modal__Body}>
                            <div className={styles.Modal__Body__Content}>
                                <div>
                                    <p>{t("adminAsk")}</p>
                                </div>
                                <div className={styles.Modal__Body__Bottom}>
                                    <SecondaryButton text={t("adminNo")} classType={"danger"} type='left' onClick={() => setShowRevertModal(false)} />
                                    <SecondaryButton text={t("adminYes")} classType={"success"} type='right' onClick={() => {setShowRevertModal(false); getDefaults();}} />
                                </div>
                            </div>
                        </section>
                    </div>
                }
                {
                    (showConfirmModal) &&
                    <div className={styles.Modal}>
                        <section ref={confirmRef} className={styles.Modal__Body}>
                            <div className={styles.Modal__Body__Content}>
                                <div>
                                    <p>{t("adminAsk")}</p>
                                </div>
                                <div className={styles.Modal__Body__Bottom}>
                                    <SecondaryButton text={t("adminNo")} classType={"danger"} type='left' onClick={() => setShowConfirmModal(false)} />
                                    <SecondaryButton text={t("adminYes")} classType={"success"} type='right' onClick={() => {setShowConfirmModal(false); updateUser();}} />
                                </div>
                            </div>
                        </section>
                    </div>
                }
                {
                    (user && user.isAdmin && isAuthenTicated && userID && targetUser && remainingRooms) &&
                    <> 
                        <section className={styles.Admin__User}>
                            <div className={styles.Admin__User__Picture}>
                                <picture>
                                    <source srcSet={`${targetUser.user.picture ? (`/uploads/${targetUser.user.picture.split('.')[0]}_x1.${targetUser.user.picture.split('.')[1]} 1x, /uploads/${targetUser.user.picture.split('.')[0]}_x2.${targetUser.user.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                                    <img srcSet={`${targetUser.user.picture ? (`/uploads/${targetUser.user.picture.split('.')[0]}_x1.${targetUser.user.picture.split('.')[1]} 1x, /uploads/${targetUser.user.picture.split('.')[0]}_x2.${targetUser.user.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} alt="User Picture" src="/Default_profile_x2.jpg" loading="lazy" />
                                </picture>
                            </div>
                            <div className={styles.Admin__User__Content}>
                                <div className={styles.Admin__User__Top}>
                                    <div className={styles.Admin__User__Title}>
                                        <h2>
                                            {targetUser.user.fursonaName}
                                        </h2>
                                        <h3>
                                            {targetUser.user.fursonaSpecies}
                                        </h3>
                                    </div>
                                    {(targetUser.user.isFursuiter == true || (!_.isEmpty(targetUser.ticket) && targetUser.ticket.sponsorLevel && parseInt(targetUser.ticket.sponsorLevel) > 0)) &&
                                        <div className={styles.Admin__User__Badges}>
                                            {
                                                (targetUser.user.isFursuiter == true) &&
                                                <Tippy className={styles.Tooltip} content={t("partSuiter")}>
                                                    <span>
                                                        <FursuiterIcon style={{ "fill": "#F741D5" }} />
                                                    </span>
                                                </Tippy>
                                            }
                                            {
                                                (targetUser.ticket?.sponsorLevel && parseInt(targetUser.ticket.sponsorLevel) > 0) &&
                                                <Tippy className={styles.Tooltip} content={(parseInt(targetUser.ticket.sponsorLevel) == 2) ? t("ticketSuperSponsor") : t("partSponsor")}>
                                                    <span>
                                                        <SponsorIcon style={{ "fill": "#F741D5" }} />
                                                    </span>
                                                </Tippy>
                                            }
                                        </div>
                                    }
                                </div>
                                <div className={styles.Admin__User__Bottom}>
                                    <div>
                                        <SecondaryButton text={t("adminReject")} disabled={targetUser.account.isVerified === -1 || targetUser.account.isVerified === 1} type="left" classType={"danger"} onClick={() => updateState(setTargetUser, 'account', -1, 'isVerified')}/>
                                        <SecondaryButton text={t("adminVerify")} disabled={targetUser.account.isVerified === 1 || targetUser.account.isVerified === true} type="right" classType={"success"} onClick={() => updateState(setTargetUser, 'account', true, 'isVerified')}/>
                                    </div>
                                    <div>
                                        <DropDown
                                            label={`${t("adminPaymentMethod")}: `}
                                            buttonPlaceholder={t("adminPaymentMethod")}
                                            data={paymentMethods}
                                            onChange={(e: string) => updateState(setTargetUser, 'ticket', e, "paymentMethod")}
                                            selected={targetUser.ticket.paymentMethod}
                                            setSelected={(e: string) => updateState(setTargetUser, 'ticket', e, "paymentMethod")}
                                            setValue={(e: string) => updateState(setTargetUser, 'ticket', e, "paymentMethod")}
                                            buttonType="left"
                                        />
                                        <SecondaryButton text={t("adminPaymentConf")} type="right" disabled={_.isEmpty(targetUser.ticket) || (!_.isEmpty(targetUser.ticket) && targetUser.ticket.isPaid == 1)} classType={"success"} onClick={() => updateState(setTargetUser, 'ticket', true, 'isPaid')}/>
                                    </div>
                                    {
                                    (_.isEmpty(originalUser.accomodation) && targetUser.ticket.isPaid == true && targetUser.ticket.ticketType === '2') &&
                                    <div>
                                        <FilterableDropDown
                                            label={`${t("adminRoomForce")}: `}
                                            buttonPlaceholder={t("adminRoomForce")}
                                            setSelected={setSelected}
                                            setValue={(e: string) => updateState(setTargetUser, 'accomodation', e, "roomId")}
                                            selected={selected}
                                            searchPlaceholder={t("regSearchablePlaceholder")}
                                            data={remainingRooms}
                                            dataDisplayVal={["building", "roomNumber", "freeSpots"]}
                                            dataValue={"id"}
                                            onChange={(e: string) => updateState(setTargetUser, 'accomodation', e, "roomId")}
                                        />
                                    </div>
                                    }
                                    <div>
                                        <SecondaryButton text={t("adminRemovePic")} disabled={!targetUser.user.picture} type="left" classType={"danger"} onClick={() => updateState(setTargetUser, 'user', null, 'picture')}/>
                                        <SecondaryButton text={t("adminRemoveRoom")} disabled={_.isEmpty(targetUser.accomodation)} type="right" classType={"danger"} onClick={() => updateState(setTargetUser, 'accomodation', null)}/>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {
                            Object.keys(targetUser).map((key, i) => {
                                return (
                                    <div key={i} className={styles.Admin__Content}>
                                        <h3>{key}</h3>
                                        {
                                            (!targetUser[key]) &&
                                            null
                                        }
                                        {
                                            (targetUser[key]) &&
                                            Object.keys(targetUser[key]).map((key2, j) => {
                                                return (
                                                    <span key={j}>
                                                        {`${key2}: ${targetUser[key][key2]}`}
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </>
                }
                {
                    (emailLimit != undefined) &&
                    <div className={styles.Admin__Top} style={(emailLimit <= 10)? {background: 'red'} : {}}>
                        <div>
                            {`${t("adminLimit")}: ${emailLimit}`}
                        </div>
                    </div>
                }
                {
                    (showConfirm == true) &&
                    <div className={styles.Admin__Bottom}>
                        <div>
                            <SecondaryButton text={t("adminRevert")} type="left" classType={"danger"} onClick={() => setShowRevertModal(true)}/>
                            <SecondaryButton text={t("adminSave")} type="right" classType={"success"} onClick={() => setShowConfirmModal(true)}/>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default AdminUser;
*/

import { useEffect, useState, useRef, JSXElementConstructor } from "react";
import RoomSelector from "@/comp/input/RoomSelector";
import axiosInstance from "@/functions/utils/axiosConfig";
import Button from "@/comp/button/Button";
import Toggle from "@/comp/input/Toggle";
import DropDown from "@/comp/input/DropDown";
import { NextPage } from "next";
import Router from 'next/router'
import AttendeeDetails from "@/comp/admin/AttendeeDetails";
import TicketDetails from "@/comp/admin/TicketDetails";
import FursonaDetails from "@/comp/admin/FursonaDetails";
import RoomDetails from "@/comp/admin/RoomDetails";
import ChangeList from "@/comp/admin/ChangeList";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { ITicket } from "@/models/newDbModels/ticket.model";
import { IFursona } from "@/models/newDbModels/fursona.model";
import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { IRoom } from "@/models/newDbModels/room.model";
import styles from "@/styles/pages/Admin.module.scss"
import { defaultPadding } from "ol/render/canvas";
import { useUser } from "@/hooks/user/useUser";

type Props = {}

type PaymentMethodInterface = 'Bank' | 'PayPal' | 'Revolut' | null;

const AdminUser: NextPage<Props> = (props: Props) => {
  const { selectedAttendeeId } = Router.query

  const [verifiedStatus, setVerifiedStatus] = useState<boolean>(false);
  const [defaultVerifiedStatus, setDefaultVerifiedStatus] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
  const [defaultPaymentStatus, setDefaultPaymentStatus] = useState<boolean>(false);

  const [attendee, setAttendee] = useState<IAttendee>()
  const [ticket, setTicket] = useState<ITicket>()
  const [fursona, setFursona] = useState<IFursona>()
  const [accomodation, setAccomodation] = useState<IAccomodation>()
  const [room, setRoom] = useState<IRoom>()
  const [roommates, setRoommates] = useState<string[]>([])

  const [freeRooms, setFreeRooms] = useState<IRoom[]>([])
  const [selectedFreeRoom, setSelectedFreeRoom] = useState<number>(0)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodInterface>(null)
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethodInterface>(null)
  const [paymentMethods] = useState<PaymentMethodInterface[]>([
    null,
    'Bank',
    'PayPal',
    'Revolut'
  ])

  const [deleteControlsHidden, setDeleteControlsHidden] = useState<boolean>(true);
  const [paymentControlsHidden, setPaymentControlsHidden] = useState<boolean>(true);
  const [fursonaControlsHidden, setFursonaControlsHidden] = useState<boolean>(true);
  const [roomControlsHidden, setRoomControlsHidden] = useState<boolean>(true);

  const [provisionalUpdates, setProvisionalUpdates] = useState<string[]>([])

  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [imageDeleteFlag, setImageDeleteFlag] = useState<boolean>(false);
  const [accomodationDeleteFlag, setAccomodationDeleteFlag] = useState<boolean>(false);

  const [emailCount, setEmailCount] = useState<number>(0);

  const { user, didUserInit } = useUser()
  const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)
  
  // ===============================================
  // AUTHENTICATION
  // ===============================================
  useEffect(() => {
    if (!didUserInit) return
    if (!user || !user.attendee.admin) {
        Router.push('/')
    }
    else if (user && user.attendee.admin) {
        runAuth()
    }
}, [didUserInit])

  const runAuth = async () => {
    await axiosInstance.get(`/api/admin/auth`)
      .then((res) => {
          setIsAuthenticated(true)
          getAttendee();
      })
      .catch((err) => {
          setIsAuthenticated(false)
          Router.push('/')
      })
      .finally(() => {
        // If using loading  
        // setIsLoading(false)
      })
  }

  useEffect(() =>{
    getTicket();
    getFursona();
    getAccomodation();
  }, [attendee])

  useEffect(() =>{
    getRoom();
  }, [accomodation])

  useEffect(() =>{
    getRoommates();
    getFreeRooms();
  }, [room])

  useEffect(() =>{
    if(ticket === undefined){
        setPaymentControlsHidden(true);
    } else {
        setPaymentControlsHidden(false);
    }
  }, [ticket])

  useEffect(() =>{
    if(fursona === undefined){
        setFursonaControlsHidden(true);
    } else {
        setFursonaControlsHidden(false);
    }
  }, [fursona])

  useEffect(() =>{
    if(accomodation === undefined || room === undefined){
        setRoomControlsHidden(true);
    } else {
        setRoomControlsHidden(false);
    }
  }, [accomodation, room])

  const getAttendee = async () => {
    await axiosInstance.get('/api/v2/attendee/', { params: {id: selectedAttendeeId}})
      .then((res) => {
        setAttendee(res.data);
        if(res.data.verified === 1){
            setVerifiedStatus(true);
            setDefaultVerifiedStatus(true);
            setDeleteControlsHidden(true);
        } else {
            setVerifiedStatus(false);
            setDefaultVerifiedStatus(false);
            setDeleteControlsHidden(false);
        }
    })
    .catch((err) => {
      return
    })
  }

  const getFreeRooms = async () => {
    await axiosInstance.get('/api/v2/room/getFreeRooms')
        .then((res) => {
            let freeRoomTemp = []
            if (typeof res.data === 'object'){
                freeRoomTemp.push(res.data)
            } else {
                freeRoomTemp = res.data
            }
            setFreeRooms(freeRoomTemp)
            if (room !== undefined){
                setFreeRooms(freeRooms => [room,...freeRooms] );
            }
        })
        .catch((err) => {
            return
        })
  }

  const getTicket = async () => {
    if (attendee !== undefined && ticket === undefined && attendee.ticketId !== undefined){
        await axiosInstance.get('/api/v2/ticket/', { params: {id: attendee.ticketId}})
            .then((res) => {
                setTicket(res.data);
                if(res.data.isPaid === 1){
                    setPaymentStatus(true);
                    setDefaultPaymentStatus(true);
                } else {
                    setPaymentStatus(false);
                    setDefaultPaymentStatus(false);
                }
                if(res.data.paymentMethod === undefined) {
                    setPaymentMethod(null)
                    setDefaultPaymentMethod(null)
                } else {
                    setPaymentMethod(res.data.paymentMethod)
                    setDefaultPaymentMethod(res.data.paymentMethod)
                }
            })
            .catch((err) => {
                return
        })
    }
  }

  const getFursona = async () => {
    if (attendee !== undefined && fursona === undefined && attendee.fursonaId !== undefined){
        await axiosInstance.get('/api/v2/fursona/', { params: {id: attendee.fursonaId}})
            .then((res) => {
                setFursona(res.data);
            })
            .catch((err) => {
                return
        })
    }
  }

  const getAccomodation = async () => {
    if (attendee !== undefined && accomodation === undefined && attendee.accomodationId !== undefined){
        await axiosInstance.get('/api/v2/accomodation/', { params: {id: attendee.accomodationId}})
            .then((res) => {
                setAccomodation(res.data);
            })
            .catch((err) => {
                return
        })
    }
  }

  const getRoom = async () => {
    if (accomodation !== undefined && room === undefined && accomodation.roomId !== undefined){
        await axiosInstance.get('/api/v2/room/', { params: {id: accomodation.roomId}})
            .then((res) => {
                setRoom(res.data);
                setSelectedFreeRoom(res.data.id);
            })
            .catch((err) => {
                return
        })
    }
  }

  const getRoommates = async () => {
    if (room !== undefined && roommates.length === 0 && room.id !== undefined && attendee !== undefined && attendee.id !== undefined){
        await axiosInstance.get('/api/v2/accomodation/getRoommates', { params: {roomId: room.id, attendeeId: attendee.id}})
            .then((res) => {
                setRoommates(res.data);
            })
            .catch((err) => {
                return
        })
    }
  }

  const routerBackToAdmin = () => {
    Router.push(
        '/admin'
    )
  }

  const finalizeDeleteAttendee = async () =>{
    if (attendee === undefined){
        return;
    } else {
        axiosInstance.delete('/api/v2/attendee/deleteAttendee', {data: {id: attendee.id, fursonaId: attendee.fursonaId, ticketId: attendee.ticketId, attendeeEmail: attendee.email}})
    }
  }

  const finalizeVerifiedStatus = async () =>{
    if (attendee === undefined){
        return;
    } else {
        axiosInstance.post('/api/v2/attendee/updateAttendee', {params: {id: attendee.id, verifiedStatus: verifiedStatus}})
    }
  }

  const finalizePaymentStatusAndMethod = async () =>{
    if (attendee === undefined){
        return;
    } else {
        axiosInstance.post('/api/v2/ticket/updateTicket', {params: {id: attendee.ticketId, paymentStatus: paymentStatus, paymentMethod: paymentMethod}})
    }
  }

  const finalizeDeleteImage = async () => {
    if (attendee === undefined){
        return;
    } else {
        axiosInstance.post('/api/v2/fursona/updateFursona', {params: {id: attendee.fursonaId, pathToPictureFile: null}})
    }
  }

  const finalizeDeleteRoom = async () => {
    if (attendee === undefined){
        return;
    } else {
        axiosInstance.delete('/api/v2/accomodation/deleteAccomodation', {data: {id: attendee.accomodationId}})
    }
  }

  const finalizeAssignedRoom = async () => {
    if (attendee === undefined){
        return;
    } else {
        if (attendee.accomodationId === undefined || attendee.accomodationId === null){
            axiosInstance.put('/api/v2/accomodation/insertAccomodation', {params: {attendeeId: attendee.id, roomId: selectedFreeRoom}})
        } else {
            axiosInstance.post('/api/v2/accomodation/updateAccomodation', {params: {accomodationId: attendee.accomodationId, roomId: selectedFreeRoom}})
        }
    }
  }

  const finalizeChanges = async () => {
    if(attendee === undefined){
        return;
    } else {
        const promiseDeleteAttendee = await finalizeDeleteAttendee;
        const promiseVerifiedStatus = await finalizeVerifiedStatus;
        const promisePaymentStatusAndMethod = await finalizePaymentStatusAndMethod;
        const promiseDeleteImage = await finalizeDeleteImage;
        const promiseDeleteRoom = await finalizeDeleteRoom;
        const promiseAssignedRoom = await finalizeAssignedRoom;

        let promises = [];
        if (provisionalUpdates.indexOf("deleteFlag") > -1){
            promises = [promiseDeleteAttendee()]
        } else {
            if (provisionalUpdates.indexOf("verifiedStatus") > -1){
                promises.push(promiseVerifiedStatus())
            }
            if (provisionalUpdates.indexOf("paymentStatus") > -1 || provisionalUpdates.indexOf("paymentMethod") > -1){
                promises.push(promisePaymentStatusAndMethod())
            }
            if (provisionalUpdates.indexOf("imageDeleteFlag") > -1){
                promises.push(promiseDeleteImage())
            }
            if (provisionalUpdates.indexOf("accomodationDeleteFlag") > -1){
                promises.push(promiseDeleteRoom())
            }
            if (provisionalUpdates.indexOf("assignedRoom") > -1 && !(provisionalUpdates.indexOf("accomodationDeleteFlag") > -1)){
                promises.push(promiseAssignedRoom())
            }
        }

        Promise.all(promises).then((values) => {
            Router.push('/admin');
          })
          .catch((err) => {
            return;
        })


        /*if (provisionalUpdates.indexOf("deleteFlag") > -1){
            await finalizeDeleteAttendee()
            .then((res) => {
                Router.push('/admin');
            })
            .catch((err) => {
                return;
            })
        } else {
            if (provisionalUpdates.indexOf("verifiedStatus") > -1){
                await finalizeVerifiedStatus()
                .then(async (res) => {
                    if (provisionalUpdates.indexOf("paymentStatus") > -1 || provisionalUpdates.indexOf("paymentMethod") > -1){
                        await finalizePaymentStatusAndMethod()
                        .then(async (res) => {
                            if (provisionalUpdates.indexOf("imageDeleteFlag") > -1){
                                await finalizeDeleteImage()
                                .then((res) => {
                                    Router.push('/admin');
                                })
                                .catch((err) => {
                                    return;
                                })
                            } else {
                                Router.push('/admin');
                            }
                        })
                        .catch((err) => {
                            return;
                        })
                    } else {
                        if (provisionalUpdates.indexOf("imageDeleteFlag") > -1){
                            await finalizeDeleteImage()
                            .then((res) => {
                                Router.push('/admin');
                            })
                            .catch((err) => {
                                return;
                            })
                        } else {
                            Router.push('/admin');
                        }
                    }
                })
                .catch((err) =>{
                    return;
                })
            } else {
                if (provisionalUpdates.indexOf("paymentStatus") > -1 || provisionalUpdates.indexOf("paymentMethod") > -1){
                    await finalizePaymentStatusAndMethod()
                    .then(async (res) => {
                        if (provisionalUpdates.indexOf("imageDeleteFlag") > -1){
                            await finalizeDeleteImage()
                            .then((res) => {
                                Router.push('/admin');
                            })
                            .catch((err) => {
                                return;
                            })
                        } else {
                            Router.push('/admin');
                        }
                    })
                    .catch((err) => {
                        return;
                    })
                } else {
                    if (provisionalUpdates.indexOf("imageDeleteFlag") > -1){
                        await finalizeDeleteImage()
                        .then((res) => {
                            Router.push('/admin');
                        })
                        .catch((err) => {
                            return;
                        })
                    } else {
                        return;
                    }
                }
            }
        }*/
        
    }
  }

  const flagAttendeeForDelete = () => {
        setDeleteFlag(!deleteFlag);
    }

    const flagImageForDelete = () => {
        setImageDeleteFlag(!imageDeleteFlag);
    }

    const flagAccomodationForDelete = () => {
        setAccomodationDeleteFlag(!accomodationDeleteFlag);
    }

    const getEmailCount = async () => {
        await axiosInstance.get('/api/admin/email-limit')
            .then((res) => {
                setEmailCount(res.data);
            })
            .catch((err) => {
                setEmailCount(0);
        })
    }

    const getProvisionalUpdates = () => {
        let provisionalUpdateList = [];
        if (defaultVerifiedStatus !== verifiedStatus){
            provisionalUpdateList.push("verifiedStatus")
        }
        if (defaultPaymentStatus !== paymentStatus){
            provisionalUpdateList.push("paymentStatus")
        }
        if (defaultPaymentMethod !== paymentMethod){
            provisionalUpdateList.push("paymentMethod")
        }
        if (room?.id !== selectedFreeRoom){
            provisionalUpdateList.push("assignedRoom")
        }
        if (imageDeleteFlag === true){
            provisionalUpdateList.push("imageDeleteFlag")
        }
        if (accomodationDeleteFlag === true){
            provisionalUpdateList.push("accomodationDeleteFlag")
        }
        if (deleteFlag === true){
            provisionalUpdateList.push("deleteFlag")
        }
        setProvisionalUpdates([...provisionalUpdateList]);
        getEmailCount();
    }

  useEffect(() =>{
    getProvisionalUpdates();
  }, [verifiedStatus, paymentStatus, paymentMethod, deleteFlag, imageDeleteFlag, accomodationDeleteFlag, selectedFreeRoom])

  return (
    <>
        {
            (isAuthenTicated == true) &&
            <div className={styles.Admin}>
                <Button onClick={routerBackToAdmin}>BACK</Button>
                <div className={styles.Admin__Content}>
                    <div className={styles.Admin__Content__TableContainer}>
                        <h2>ATTENDEE</h2>
                        <AttendeeDetails attendee={attendee}></AttendeeDetails>
                    </div>
                    <div className={styles.Admin__Content__TableContainer}>
                        <h2>TICKET</h2>
                        <TicketDetails ticket={ticket}></TicketDetails>
                    </div>
                    <div className={styles.Admin__Content__TableContainer}>
                        <h2>FURSONA</h2>
                        <FursonaDetails fursona={fursona}></FursonaDetails>
                    </div>
                    <div className={styles.Admin__Content__TableContainer}>
                        <h2>ROOM</h2>
                        <RoomDetails room={room} roommates={roommates} accommodation={accomodation}></RoomDetails>
                    </div>
                </div>
                <div className={styles.Admin__Content}>
                    <Button 
                        disabled={deleteControlsHidden}
                        onClick={flagAttendeeForDelete}>Reject & Delete Attendee</Button>
                </div>
                <hr></hr>
                <div className={styles.Admin__Content}>
                    <Toggle 
                        id={"verifiedToggle"} 
                        label={"Verified?"} 
                        checked={verifiedStatus}
                        stateChanger={setVerifiedStatus}
                        ></Toggle>
                    <Toggle 
                        hidden={paymentControlsHidden}
                        id={"paymentToggle"} 
                        label={"Paid?"} 
                        checked={paymentStatus}
                        stateChanger={setPaymentStatus}
                        ></Toggle>
                    <DropDown
                        hidden={paymentControlsHidden}
                        label={"Payment method"}
                        buttonPlaceholder={"Select payment method"}
                        data={paymentMethods}
                        onChange={(e: PaymentMethodInterface) => setPaymentMethod(e)}
                        selected={paymentMethod}
                        setSelected={(e: PaymentMethodInterface) => setPaymentMethod(e)}
                        setValue={(e: PaymentMethodInterface) => setPaymentMethod(e)}></DropDown>
                </div>
                <hr></hr>
                <div className={styles.Admin__Content}>
                    <Button 
                        disabled={fursonaControlsHidden}
                        onClick={flagImageForDelete}
                        >Remove Image</Button>
                    <Button 
                        disabled={roomControlsHidden}
                        onClick={flagAccomodationForDelete}
                        >Remove from Room</Button>
                    <RoomSelector
                        disabled={(ticket === undefined || ticket.isPaid === undefined || ticket.isPaid === null || ticket.isPaid === false) ? true : false}
                        label={"Assign to Room"}
                        onChange={(e) => setSelectedFreeRoom(e)}
                        value={room === undefined || room.id === undefined ? 0 : room.id}
                        roomList={freeRooms}
                    ></RoomSelector>
                </div>
                <hr></hr>
                <div className={styles.Admin__Content}>
                    <span>
                        <b>CHANGELIST:</b><br></br>
                        <ChangeList changes={provisionalUpdates}></ChangeList>
                    </span>
                    <span>
                        <b>CURRENT EMAIL COUNTER:</b><br></br>
                        <p>{emailCount}/50 remaining</p>
                    </span>
                    <Button onClick={finalizeChanges}>FINALIZE CHANGES</Button>
                </div>
            </div>
        }
    </>
  );
}
export default AdminUser