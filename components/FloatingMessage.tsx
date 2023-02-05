/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import styles from "@/styles/components/FloatingMessage.module.scss"
import { RiCloseFill } from "react-icons/ri";

type Props = {
  type: "Error" | "Success" | "Info";
  message: string;
  duration?: number;
  autocloses?: boolean;
  closable?: boolean;
  id?: number;
  onClose: (index: number) => void;
};

const FloatingMessage: NextPage<Props> = ({
  type,
  message,
  closable = true,
  autocloses = false,
  duration = 10,
  onClose,
  id
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const CheckType = (typeL: "Error" | "Success" | "Info") => {
    switch (typeL) {
      case "Error":
        return styles.error;
      case "Info":
        return styles.info;
      case "Success":
        return styles.success;
    }
  };

  const close = () => {
    divRef.current?.classList.remove(styles.open);
    onClose(id || 0);
  };

  useEffect(() => {
    if (divRef) {
      divRef.current?.classList.add(styles.open);
    }
  }, [divRef]);

  useEffect(() => {
    if (autocloses) {
      const closeTimeOut = setTimeout(() => {
        close();
      }, duration * 1000);

      return () => clearTimeout(closeTimeOut);
    }
  }, []);

  return (
    <div
      id={`floatingMsg_${id?.toString()}`}
      ref={divRef}
      className={`${styles.MessageBox}`}
    >
      <div className={`${styles.MessageBox__Content} ${CheckType(type)}`}>
        <span className={styles.MessageBox__Text}>{message}{" "}</span>
        {closable && (
          <span onClick={() => close()} className={styles.MessageBox__Btn}>
            <RiCloseFill size={24}></RiCloseFill>
          </span>
        )}
      </div>
    </div>
  );
};

export default FloatingMessage;
