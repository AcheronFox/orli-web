import { IUser } from '@/models/user.model';
import axiosInstance from '@/utils/axiosConfig';
import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import Router, { useRouter } from 'next/router';
import { ILoginForm } from '@/models/login-form.model';
import { useTranslate } from './useTranslate';
import { FloatingMessageContext } from './FloatingMessageContext';
import { IUpdateForm } from '@/models/update.model';

export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const { t } = useTranslate()
    const { AddFloatingMessage } = useContext(FloatingMessageContext);
    const [didUserInit, setDidUserInit] = useState(false)
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
                            message: t("loginErrNotFound"),
                        });
                        break;
                    case 401:
                        if (err.response.data && err.response.data.message.toLowerCase() == "unverified") {
                            AddFloatingMessage({
                                autocloses: true,
                                type: "Error",
                                message: t("loginUnverifiedErr"),
                            });
                            break;
                        } else {
                            AddFloatingMessage({
                                autocloses: true,
                                type: "Error",
                                message: t("loginPassErr"),
                            });
                            break;
                        }
                    case 400:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: t("errBadRequest"),
                        });
                        break;
                    default:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: t("errDefault"),
                        });
                        break;
                }
            } else {
                AddFloatingMessage({
                    autocloses: true,
                    type: "Error",
                    message: t("errDefault"),
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
        if (router.pathname == "/profile") router.push("/login");
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
                    message: t("profSuccess"),
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
                            message: t("errBadRequest"),
                        });
                        break;
                    default:
                        AddFloatingMessage({
                            autocloses: true,
                            type: "Error",
                            message: t("errDefault"),
                        });
                        break;
                }
            } else {
                AddFloatingMessage({
                    autocloses: true,
                    type: "Error",
                    message: t("errDefault"),
                });
            }
        })
        .finally(() => {
            cb()
        });
    }

    return { user, didUserInit, addUser, removeUser, setUser, getUser, login, logout, updateUser };
};
