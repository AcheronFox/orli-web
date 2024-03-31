import {
    createContext,
} from "react"

interface INotificationContext {
    Notifications: INotification[] | null
    addNotification: (notification: INotification) => void
    removeNotification: (id: string) => void
}

export const NotificationContext = createContext<INotificationContext>({
    Notifications: null,
    addNotification: (notification: INotification) => { },
    removeNotification: (id: string) => { },
})