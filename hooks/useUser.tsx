import { IUser } from '@/models/user.model';
import axiosInstance from '@/utils/axiosConfig';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Router, { useRouter } from 'next/router';
import { ILoginForm } from '@/models/login-form.model';
import { useTranslate } from './useTranslate';
import { FloatingMessageContext } from './FloatingMessageContext';

export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const { t } = useTranslate()
    const { AddFloatingMessage } = useContext(FloatingMessageContext);
    const router = useRouter();

    const addUser = (val: IUser) => {
        setUser(val);
    };

    const removeUser = () => {
        setUser(null);
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
            if (err.response.status) {
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

    return { user, addUser, removeUser, setUser, getUser, login, logout };
};
