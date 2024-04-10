/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { hyphenateSync  as hyphenateEn } from "hyphen/en";
import { hyphenateSync  as hyphenateHu } from "hyphen/hu";

const useHyphenate = () => {
    const process = (locale: string, text: string) => {
        switch(locale) {
            case 'en':
                return hyphenateEn(text)
            case 'hu':
                return hyphenateHu(text)
        }
    }   

    return process
}

export default useHyphenate