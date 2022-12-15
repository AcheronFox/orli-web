import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";

import styles from "@/styles/components/FloatingMessage.module.scss";
import FloatingMessage from "./FloatingMessage";
import { FloatingMessageContext } from "./FloatingMessageContext";

type Props = {
  children: React.ReactNode;
};

interface FloatingMessage {
  type: "Error" | "OK" | "Info";
  message: string;
  duration?: number;
  autocloses?: boolean;
  closable?: boolean;
  id?: number;
}
function useForceUpdate() {
  let [value, setState] = useState(true);
  return () => setState(!value);
}

const FloatingMessageWrapper: NextPage<Props> = ({ children }: Props) => {
  const handleForceupdateMethod = useForceUpdate();
  const [floatingmsgs, setFloatingMsgs] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const HandleClose = useCallback((index: number) => {
    setFloatingMsgs((fl: [FloatingMessage]) => fl.filter((x, i) => x.id != index));
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
        <div className={styles.FloatingMessageWrapper}>
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
