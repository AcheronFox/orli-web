import React from "react"
import styles from "@/styles/components/notification/NotificationDisplayer.module.scss"
import NotificationComponent from "./NotificationComponent";

interface Props {
    Notifications: INotification[]
}

const NotificationDisplayer = ({Notifications}: Props) => {
  return (
    <div className={styles.NotificationDisplayer}>
      {Notifications.map(x => <NotificationComponent key={x.id} Notification={x}></NotificationComponent>)}
    </div>
  )
};

export default NotificationDisplayer;
