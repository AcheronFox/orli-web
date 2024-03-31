/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react"
import styles from "@/styles/components/notification/NotificationComponent.module.scss"

import { RiCloseFill } from "react-icons/ri"
import useNotification from "@/hooks/notification/useNotification"
import IconButton from "../button/IconButton"

interface Props {
  Notification: INotification
  right: boolean
}

const NotificationComponent = ({ Notification, right }: Props) => {
  const { removeNotification } = useNotification();
  const [slideout, setSlideOut] = useState<boolean>(false)
  const [slidein, setSlidein] = useState<boolean>(true)
  const ref = useRef<HTMLDivElement | null>(null)

  const getNotifTypeStyle = (type: typeof Notification.type) => {
    switch (type) {
      case "error":
        return styles.Error
      case "success":
        return styles.Success
      case "warning":
        return styles.Warning
      default:
        return styles.Info
    }
  }

  useEffect(() => {
    const slideInDuration = setTimeout(() => {
      setSlidein(false)
    }, 300)

    const duration = setTimeout(() => {
      setSlideOut(true)
      setTimeout(() => {
        removeNotification(Notification.id as string)
      }, 300)
    }, (Notification.duration || 20) * 1000)
    return () => {
      clearTimeout(slideInDuration)
      clearTimeout(duration)
    }
  }, [])

  useEffect(() => {
    if (ref) {
      ref.current?.style.setProperty("--duration", `${(Notification.duration || 20)}s`)
    }
  }, [ref])


  const close = () => {
    setSlideOut(true)
    setTimeout(() => {
      removeNotification(Notification.id as string)
    }, 175)
  }

  return (
    <div
      className={
        `
        ${styles.Notification}
        ${slidein? styles.slideIn : ''}
        ${slideout? styles.slideOut : ''}
        ${getNotifTypeStyle(Notification.type)}
        ${right? styles.Notification__Right : styles.Notification__Left}
        `
      }
      ref={ref}>
      <span
        className={
          `${styles.Notification__Title} ${getNotifTypeStyle(Notification.type)}`
        }>
        {Notification.title}
        <span
          className={styles.Notification__Title__Close}
        >
            <IconButton size={"22"} onClick={() => close()}>
              <RiCloseFill color="red"></RiCloseFill>
            </IconButton>
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
