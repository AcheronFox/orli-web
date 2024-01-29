/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const useLocaleSwitch = (locale: string, fileName: string) => {
    const [data, setData] = useState<any>();

    useEffect(() => {
        setData(
            require(`../../locales/${locale}/${locale}.${fileName}`)
        )
    }, [locale, fileName]);

    return data;
};

export default useLocaleSwitch;