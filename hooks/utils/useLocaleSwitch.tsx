/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const useLocaleSwitch = (locale: string, fileName: string) => {
    const [data, setData] = useState<any>();

    useEffect(() => {
        const temp = require(`../../locales/${locale}/${locale}.${fileName}`)
        
        setData(temp.default? temp.default : temp)
    }, [locale, fileName]);

    return data;
};

export default useLocaleSwitch;