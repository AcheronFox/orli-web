/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import styles from "@/styles/components/notification/NotificationComponent.module.scss"

import { RiCloseFill } from "react-icons/ri"
import useNotification from "@/hooks/notification/useNotification"
import IconButton from "../button/IconButton"
import useTranslate from "@/hooks/translate/useTranslate"

interface Props {
  Notification: INotification
  right: boolean
}

const NotificationComponent = forwardRef(({ Notification, right }: Props, ref) => {
  const { removeNotification } = useNotification();
  const { lang, currLang } = useTranslate()

  const [slideout, setSlideOut] = useState<boolean>(false)
  const [slidein, setSlidein] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const innerRef = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => ({
    closeSelf() {
      close()
    }
  }));

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

  const getNotifTitle = (type: typeof Notification.type, title?: string) => {
    if (title) return title
    switch (type) {
      case "error":
        return lang.notifError
      case "success":
        return lang.notifSuccess
      case "warning":
        return lang.notifWarning
      default:
        return lang.notifInfo
    }
  }

  useEffect(() => {
    setTitle(getNotifTitle(Notification.type, Notification.title))

    const slideInDuration = setTimeout(() => {
      setSlidein(false)
    }, 300)

    const duration = Notification.autoClose
    ? setTimeout(() => {
        setSlideOut(true)
        setTimeout(() => {
          removeNotification(Notification.id as string)
        }, 175)
      }, (Notification.duration || 20) * 1000)
    : undefined

    return () => {
      clearTimeout(slideInDuration)
      if (duration) clearTimeout(duration)
    }
  }, [])

  useEffect(() => {
    setTitle(getNotifTitle(Notification.type, Notification.title))
  }, [currLang])

  useEffect(() => {
    if (innerRef) {
      if (Notification.autoClose) innerRef.current?.style.setProperty("--duration", `${(Notification.duration || 20)}s`)
    }
  }, [innerRef])

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
      ref={innerRef}>
      <span
        className={
          `${styles.Notification__Title} ${getNotifTypeStyle(Notification.type)}`
        }>
        {title}
        {
          (Notification.closable == true) &&
          <span
            className={styles.Notification__Title__Close}
          >
              <IconButton size={"22"} onClick={() => close()}>
                <RiCloseFill color="red"></RiCloseFill>
              </IconButton>
          </span>
        }
      </span>
      <hr className={styles.Notification__Divider}></hr>
      <span className={styles.Notification__Description}>
        {Notification.message}
      </span>
    </div>
  )
})

NotificationComponent.displayName = 'NotificationComponent'
export default NotificationComponent
