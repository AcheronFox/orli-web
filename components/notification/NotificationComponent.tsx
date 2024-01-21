import React, { useContext, useEffect, useRef, useState } from "react"
import styles from "@/styles/components/notification/NotificationComponent.module.scss"

import { RiCloseFill } from "react-icons/ri"
import useNotification from "@/hooks/notification/useNotification"

interface Props {
  Notification: INotification
}

const NotificationComponent = ({ Notification }: Props) => {
  const { removeNotification } = useNotification();
  const [slideout, setSlideOut] = useState<boolean>(false)
  const [slidein, setSlidein] = useState<boolean>(true)
  const ref = useRef<HTMLDivElement | null>(null)

  const getNotifTypeStyle = (type: typeof Notification.type) => {
    switch (type) {
      case "error":
        return styles.ErrorType
      case "notification":
        return styles.NotificationType
      case "success":
        return styles.SuccessType
    }
  }

  useEffect(() => {
    const slideInDuration = setTimeout(() => {
      setSlidein(false)
    }, 175)

    const duration = setTimeout(() => {
      setSlideOut(true)
      setTimeout(() => {
        removeNotification(Notification.id)
      }, 175)
    }, Notification.duration * 1000)
    return () => {
      clearTimeout(slideInDuration)
      clearTimeout(duration)
    }
  }, [])

  useEffect(() => {
    if (ref) {
      ref.current?.style.setProperty("--duration", `${Notification.duration}s`)
    }
  }, [ref])


  const close = () => {
    setSlideOut(true)
    setTimeout(() => {
      removeNotification(Notification.id)
    }, 175)
  }

  return (
    <div
      className={
        styles.Notification +
        " " +
        (slidein ? styles.slideIn : "") +
        " " +
        (slideout ? styles.slideOut : "")
      }
      ref={ref}>
      <span
        className={
          styles.Notification__Title +
          " " +
          getNotifTypeStyle(Notification.type)
        }>
        {Notification.title}
        <span
          onClick={() => close()}
          className={styles.Notification__Title__Close}>
          <RiCloseFill size={22}></RiCloseFill>
        </span>
      </span>
      <hr className={styles.Notification__Divider}></hr>
      <span className={styles.Notification__Description}>
        {Notification.description}
      </span>
    </div>
  )
}

export default NotificationComponent
