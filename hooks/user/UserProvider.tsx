/* eslint-disable react-hooks/exhaustive-deps */
import { IUser } from '@/models/user.model';
import axiosInstance from '@/functions/utils/axiosConfig';
import { getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { IAttendeeFullData } from '@/models/newDbModels/attendeeFullData.model';

type Props = {
    children?: React.ReactNode;
};

const UserProvider: NextPage<Props> = ({ children }: Props) => {
    const [user, setLocalUser] = useState<IAttendeeFullData | null>(null)
    const [didUserInit, setDidUserInit] = useState<boolean>(false)
    let didInit = false

    useEffect(() => {
        if (didInit) return
        didInit = true
        getInitial();
    }, [])

    const addUser = (val: IAttendeeFullData) => {
        setLocalUser(val);
        setDidUserInit(true)
    };

    const removeUser = () => {
        setLocalUser(null);
        setDidUserInit(true)
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

    const getInitial = () => {
        const ck = getCookie("publicToken");
        if (ck && typeof ck == "string") {
            getUser()
        } else {
            removeUser()
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            didUserInit,
            setUser: (v: IAttendeeFullData | null) => {
                setLocalUser(v)
            },
            setDidUserInit: (v: boolean) => {
                setDidUserInit(v)
            }
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
