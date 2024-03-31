import React from "react"
import styles from "@/styles/components/notification/NotificationDisplayer.module.scss"
import NotificationComponent from "./NotificationComponent";

interface Props {
    Notifications: INotification[]
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const NotificationDisplayer = ({Notifications, position}: Props) => {
  const getPosition = (pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    switch (pos) {
      case 'top-left':
        return styles.TopLeft
      case 'top-right':
        return styles.TopRight
      case 'bottom-left':
        return styles.BottomLeft
      case 'bottom-right':
        return styles.BottomRight
    }
  }

  return (
    <div className={`${styles.NotificationDisplayer} ${getPosition(position)}`}>
      {Notifications.map(x => <NotificationComponent right={(position=='top-right') || (position=='bottom-right')} key={x.id} Notification={x}></NotificationComponent>)}
    </div>
  )
};

export default NotificationDisplayer;
