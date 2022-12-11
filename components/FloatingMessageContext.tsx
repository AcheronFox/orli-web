import React, {createContext, SetStateAction, useState} from "react"
interface FloatingMessage {
    type: "Error" | "OK" | "Info";
    message: string;
    duration?: number;
    autocloses?: boolean;
    closable?: boolean;
    id?: number
  }



export const FloatingMessageContext = createContext({
    FloatingMsgs: [{}] as [FloatingMessage] | undefined,
    AddFloatingMessage: (toAdd: FloatingMessage):number => 0,
    HandleClose: (index: number) => {}
})