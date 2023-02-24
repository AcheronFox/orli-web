import { NextPage } from "next";
import React, { useCallback, useState } from "react";

import styles from "@/styles/components/FloatingMessage.module.scss";
import FloatingMessage from "./FloatingMessage";
import { FloatingMessageContext } from "./FloatingMessageContext";

type Props = {
  children: React.ReactNode;
};

interface FloatingMessage {
  type: "Error" | "Success" | "Info";
  message: string;
  duration?: number;
  autocloses?: boolean;
  closable?: boolean;
  id?: number;
}

const FloatingMessageWrapper: NextPage<Props> = ({ children }: Props) => {
  const [floatingmsgs, setFloatingMsgs] = useState<any>([]);

  const HandleClose = useCallback((index: number) => {
    if (index == undefined) return;
    const result = document.getElementById(`floatingMsg_${index.toString()}`)
    if (result) {
      result.classList.add(styles.close);
      result.classList.remove(styles.open);
      setTimeout(() => {
        setFloatingMsgs((fl: [FloatingMessage]) => fl.filter((x, i) => x.id != index));
      }, 400);
    }
  }, []);

  return (
    <FloatingMessageContext.Provider
      value={{
        FloatingMsgs: floatingmsgs,
        AddFloatingMessage: (toAdd: FloatingMessage):number => {
          let id = floatingmsgs.length;
          setFloatingMsgs([...floatingmsgs, {...toAdd, id: id}])
          return id;
        },
        HandleClose: HandleClose
      }}
    >
      <>
        <div className={styles.Wrapper}>
          {floatingmsgs?.map((x: FloatingMessage, i: number) => {
            return (
              <FloatingMessage
                type={x.type}
                onClose={HandleClose}
                message={x.message}
                duration={x.duration}
                autocloses={x.autocloses}
                closable={x.closable}
                key={x.id}
                id={x.id}
              ></FloatingMessage>
            );
          })}
        </div>
        {children}
      </>
    </FloatingMessageContext.Provider>
  );
};

export default FloatingMessageWrapper;
