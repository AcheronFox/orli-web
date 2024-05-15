/* eslint-disable react-hooks/exhaustive-deps */

const getLocaleFile = (locale: string, fileName: string) => {
    const data = require(`../../locales/${locale}/${locale}.${fileName}`)
        
    return (data.default? data.default : data)
};

export default getLocaleFile;