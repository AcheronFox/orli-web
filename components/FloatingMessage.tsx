/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import styles from "@/styles/components/floatingMessage/FloatingMessage.module.scss"
import {unmountComponentAtNode, findDOMNode} from "react-dom"

type Props = {
  type: "Error" | "OK" | "Info";
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
  duration = 5,
  onClose,
  id
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const CheckType = (typeL: "Error" | "OK" | "Info") => {
    switch (typeL) {
      case "Error":
        return styles.error;
      case "Info":
        return styles.info;
      case "OK":
        return styles.ok;
    }
  };

  const close = () => {
    divRef.current?.classList.remove(styles.open);
    setTimeout(() => {
      onClose(id || 0);
    }, 400);
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
      ref={divRef}
      className={`${styles.messageBoxWrapper} ${CheckType(type)}`}
    >
      <div className={styles.MessageBox}>
        {message}{" "}
        {closable && (
          <span onClick={() => close()} className={styles.closebtn}>
            X
          </span>
        )}
      </div>
    </div>
  );
};

export default FloatingMessage;
