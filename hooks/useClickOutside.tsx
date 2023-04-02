/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export const useClickOutside = (ref: any, cb: Function) => {
    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            if (ref.current && !ref.current.contains(event.target)) {
                cb()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref.current]);
}