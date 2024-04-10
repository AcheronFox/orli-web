import React, { createRef, forwardRef, useImperativeHandle } from "react"
import styles from "@/styles/components/notification/NotificationDisplayer.module.scss"
import NotificationComponent from "./NotificationComponent";

interface Props {
    Notifications: INotification[]
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
}

const NotificationDisplayer = forwardRef(({Notifications, position}: Props, ref) => {  
  useImperativeHandle(ref, () => ({
    close(id: string) {
      const found = Notifications.find((o) => o.id == id)
      
      if (found && found.ref?.current) {
        found.ref.current.closeSelf()
      } 
    }
  }));

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
      {
        Notifications.map(x => {
          const innerRef = createRef()
          x.ref = innerRef

          return (
            <NotificationComponent
              ref={innerRef}
              right={(position=='top-right') || (position=='bottom-right')}
              key={x.id}
              Notification={x}
            />
          );
        })
      }
    </div>
  )
});

NotificationDisplayer.displayName = 'NotificationDisplayer'
export default NotificationDisplayer;
