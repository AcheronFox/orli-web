/* eslint-disable react-hooks/exhaustive-deps */
import { IUser } from '@/models/user.model';
import axiosInstance from '@/utils/axiosConfig';
import { getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

type Props = {
    children?: React.ReactNode;
};

const AuthProvider: NextPage<Props> = ({ children }: Props) => {
    const [user, setLocalUser] = useState<IUser | null>(null)
    let didInit = false

    useEffect(() => {
        if (didInit) return
        didInit = true
        getInitial();
    }, [])

    const addUser = (val: IUser) => {
        setLocalUser(val);
    };

    const removeUser = () => {
        setLocalUser(null);
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

    const getInitial = () => {
        const ck = getCookie("publicToken");
        if (ck && typeof ck == "string") {
            getUser()
        } else {
            removeUser()
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser: (v: IUser | null) => {
                setLocalUser(v)
            },
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
