/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/AdminUser.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { useContext, useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import CustomHead from "@/comp/CustomHead";
import axiosInstance from "@/utils/axiosConfig";
import _ from "lodash";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import SecondaryButton from "@/comp/SecondaryButton";
import { useClickOutside } from "@/hooks/useClickOutside";
import DropDown from "@/comp/DropDown";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import CustomBackground from "@/comp/CustomBackground";


type Props = {}

const AdminUser: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();
    const { user, didUserInit } = useUser();
    const { AddFloatingMessage } = useContext(FloatingMessageContext);
    const routerQuery = useRouter()?.query

    const [userID, setUserID] = useState<number>()
    const [originalUser, setOriginalUser] = useState<any>()
    const [targetUser, setTargetUser] = useState<any>()
    const [emailLimit, setEmailLimit] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

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
        .then((res) => {
            getDefaults()
        })
        .catch((err) => {
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
                    (user && user.isAdmin && isAuthenTicated && userID && targetUser) &&
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