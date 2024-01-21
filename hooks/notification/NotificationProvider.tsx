import {
    createContext,
    useState,
} from "react"

import NotificationDisplayer from "@/components/notification/NotificationDisplayer"
import { NotificationContext } from "./NotificationContext"

interface Props {
    children: React.ReactNode
}




const NotificationProvider = ({ children }: Props) => {
    const [Notifications, setNotification] = useState<INotification[]>([])

    const addNotification = (notification: INotification) => {
        if (Notifications.length >= 3) {
            setNotification(o => o.slice(1))
            //Notifications.splice(0,1);
        }
        setNotification((o) => [...o, notification])
    }

    const removeNotification = (id: string) => {
        setNotification(o => o.filter(x => x.id !== id))

    }


    const createNotificationId = (): string => {
        let id = "";
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let index = 0; index < 10; index++) {
            id += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return id;
    }


    return (
        <NotificationContext.Provider value={{ Notifications, addNotification, removeNotification, createNotificationId }}>
            <NotificationDisplayer
                Notifications={Notifications}></NotificationDisplayer>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider
