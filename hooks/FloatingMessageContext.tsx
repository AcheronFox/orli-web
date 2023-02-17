import React, { createContext } from "react"
interface FloatingMessage {
    type: "Error" | "Success" | "Info";
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