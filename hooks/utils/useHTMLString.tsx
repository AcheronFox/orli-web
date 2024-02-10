/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import DOMPurify from 'dompurify'

export const useHTMLString = () => {
    const clean = (str: string) => {
        const clean = DOMPurify.sanitize(str, {USE_PROFILES: {html: true}});
        return parse(clean)
    } 

    return clean
}