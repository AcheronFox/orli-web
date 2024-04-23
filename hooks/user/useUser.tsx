import axiosInstance from '@/functions/utils/axiosConfig';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import Router, { useRouter } from 'next/router';
import { ILoginForm } from '@/models/login-form.model';
import useTranslate from '@/hooks/translate/useTranslate';
import { IUpdateForm } from '@/models/update.model';
import { IResetForm } from '@/models/reset-form.model';
import { IResetAuthForm } from '@/models/reset-auth-form.model';
import useNotification from '../notification/useNotification';
import { IAttendeeFullData } from '@/models/newDbModels/attendeeFullData.model';

export const useUser = () => {
    const { user, setUser, didUserInit, setDidUserInit } = useContext(UserContext);
    const { lang } = useTranslate()
    const { addNotification } = useNotification()
    const router = useRouter();
    
    const addUser = (val: IAttendeeFullData) => {
        setUser(val);
        setDidUserInit(true);
    };

    const removeUser = () => {
        setUser(null);
        setDidUserInit(true);
    };

    const getUser = () => {
        axiosInstance.get<IAttendeeFullData>("api/user/me")
        .then((res) => {
            addUser(res.data)
        })
        .catch(() => {
            removeUser()
        })
    }

    const login = (loginData: ILoginForm, cb: Function) => {
        axiosInstance
        .post("api/user/login", loginData)
        .then((res) => {
            addUser(res.data);
            Router.push({pathname: '/profile'})
        })
        .catch((err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        if (err.response.data && err.response.data.message.toLowerCase() == "unverified") {
                            addNotification({
                                type: "error",
                                message: lang.errLoginUnverified
                            })
                            break;
                        } else {
                            addNotification({
                                type: "error",
                                message: lang.errLoginPass
                            })
                            break;
                        }
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
            cb()
        });
    };

    const logout = async () => {
        removeUser();
        await axiosInstance.get("api/user/logout");
        if (router.pathname.includes("/profile") || router.pathname.includes("/admin")) router.push("/login");
    };

    const updateUser = async (data: IUpdateForm, cb: Function, showMsg = true) => {
        axiosInstance
        .put("api/user/update", data)
        .then(() => {
            getUser()
            if (showMsg) {
                addNotification({
                    type: "success",
                    message: lang.profSuccess
                })
                return
            }
        })
        .catch((err) => {
            addNotification({
                type: "error",
                message: lang.errDefault
            })
        })
        .finally(() => {
            cb()
        });
    }

    const createPasswordReset = (resetData: IResetForm, cb: Function) => {
        axiosInstance
        .post("api/user/reset/create", resetData)
        .then(() => {
            Router.push({pathname: '/'})
            addNotification({
                type: "success",
                message: lang.resetEmailSent
            })
        })
        .catch((err) => {
            addNotification({
                type: "error",
                message: lang.errDefault
            })
        })
        .finally(() => {
            cb()
        });
    };

    const resetPassword = (resetData: IResetAuthForm, cb: Function) => {
        axiosInstance
        .post("api/user/reset", resetData)
        .then(() => {
            Router.push({pathname: '/login'})
            addNotification({
                type: "success",
                message: lang.resetSuccess
            })
        })
        .catch((err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        Router.push({pathname: '/'})
                        addNotification({
                            type: "error",
                            message: lang.errResetToken
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
            cb()
        });
    }

    return {
        user,
        didUserInit,
        addUser,
        removeUser,
        setUser,
        getUser,
        login,
        logout,
        updateUser,
        createPasswordReset,
        resetPassword,
    };
};
