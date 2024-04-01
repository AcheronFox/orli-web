import {
    createContext,
    useRef,
    useState,
} from "react"

import NotificationDisplayer from "@/components/notification/NotificationDisplayer"
import { NotificationContext } from "./NotificationContext"

interface Props {
    children: React.ReactNode
    pos?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    maxNotif?: number
}


const NotificationProvider = ({ children, pos, maxNotif }: Props) => {
    const [Notifications, setNotification] = useState<INotification[]>([])
    const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(pos || 'bottom-left')
    const ref = useRef<any>()

    const addNotification = (notification: INotification) => {
        const newId = createNotificationId()
        notification.id = newId
        if (notification.autoClose == undefined) notification.autoClose = true
        if (notification.closable == undefined) notification.closable = true

        if (Notifications.length >= (maxNotif || 3)) {
            setNotification(o => o.slice(1))
        }
        setNotification((o) => [...o, notification])
        return newId
    }

    const removeNotification = (id: string) => {
        setNotification(o => o.filter(x => x.id !== id))
    }

    const closeNotification = (id: string) => {
        ref.current?.close(id)
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
        <NotificationContext.Provider value={{ Notifications, addNotification, closeNotification, removeNotification }}>
            <NotificationDisplayer
                ref={ref}
                position={position}
                Notifications={Notifications}
            />
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider
