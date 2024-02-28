import { IUser } from '@/models/user.model';
import axiosInstance from '@/functions/utils/axiosConfig';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import Router, { useRouter } from 'next/router';
import { ILoginForm } from '@/models/login-form.model';
import useTranslate from '@/hooks/translate/useTranslate';
import { FloatingMessageContext } from '../FloatingMessageContext';
import { IUpdateForm } from '@/models/update.model';
import { IResetForm } from '@/models/reset-form.model';
import { IResetAuthForm } from '@/models/reset-auth-form.model';

export const useUser = () => {
    const { user, setUser, didUserInit, setDidUserInit } = useContext(UserContext);
    const { lang } = useTranslate()
    const { AddFloatingMessage } = useContext(FloatingMessageContext);
    const router = useRouter();
    
    const addUser = (val: IUser) => {
        setUser(val);
        setDidUserInit(true);
    };

    const removeUser = () => {
        setUser(null);
        setDidUserInit(true);
    };

    const getUser = () => {
        axiosInstance.get<IUser>("api/user/me")
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
                    case 404:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errLoginNotFound,
                        });
                        break;
                    case 401:
                        if (err.response.data && err.response.data.message.toLowerCase() == "unverified") {
                            AddFloatingMessage({
                                autocloses: true,
                                type: "Error",
                                message: lang.errLoginUnverified,
                            });
                            break;
                        } else {
                            AddFloatingMessage({
                                autocloses: true,
                                type: "Error",
                                message: lang.errLoginPass,
                            });
                            break;
                        }
                    case 400:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errBadRequest,
                        });
                        break;
                    default:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errDefault,
                        });
                        break;
                }
            } else {
                AddFloatingMessage({
                    autocloses: true,
                    type: "Error",
                    message: lang.errDefault,
                });
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
                AddFloatingMessage({
                    autocloses: true,
                    type: "Success",
                    message: lang.profSuccess,
                });
                return
            }
        })
        .catch((err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errBadRequest,
                        });
                        break;
                    default:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errDefault,
                        });
                        break;
                }
            } else {
                AddFloatingMessage({
                    autocloses: true,
                    type: "Error",
                    message: lang.errDefault,
                });
            }
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
            AddFloatingMessage({
                autocloses: true,
                type: "Success",
                message: lang.resetEmailSent,
            });
        })
        .catch((err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 404:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errResetNotFound,
                        });
                        break;
                    case 400:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errBadRequest,
                        });
                        break;
                    default:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errDefault,
                        });
                        break;
                }
            } else {
                AddFloatingMessage({
                    autocloses: true,
                    type: "Error",
                    message: lang.errDefault,
                });
            }
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
            AddFloatingMessage({
                autocloses: true,
                type: "Success",
                message: lang.resetSuccess,
            });
        })
        .catch((err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        Router.push({pathname: '/'})
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errResetToken,
                        });
                        break;
                    case 400:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errBadRequest,
                        });
                        break;
                    default:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: lang.errDefault,
                        });
                        break;
                }
            } else {
                AddFloatingMessage({
                    autocloses: true,
                    type: "Error",
                    message: lang.errDefault,
                });
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
