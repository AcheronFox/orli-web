/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { TranslateContext } from "./TranslateContext";
import { i18n } from "../i18n";

type Props = {
  children?: React.ReactNode;
};

const TranslateProvider: NextPage<Props> = ({ children }: Props) => {
  const [shouldChange, setShouldChangeState] = useState<boolean>(
    false
  );
  const [locale, setLocale] = useState<string>(
    i18n.defaultLocale
  );

  const [LanguageFiles, setLanguageFiles] = useState<any>(i18n.languages);
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    const lang: string = navigator.language;
    const langNew: string = lang.slice(0, 2);
    setLocale(localStorage.getItem("locale") ?? i18n.defaultLocale)
    setShouldChangeState(localStorage.getItem("locale") ? false : true)
    if (i18n.locales.includes(langNew) && (localStorage.getItem("locale") ? false : true)) {
      localStorage.setItem("locale", langNew);
      setLocale(langNew);
    }
    setIsReady(true);
  }, []);

  return (
    <TranslateContext.Provider
      value={{
        shouldChange,
        setShouldChange: (v: boolean) => setShouldChangeState(v),
        locale,
        isReady,
        changeLocale: (v: string) => {
          if (i18n.locales.includes(v)) {
            localStorage.setItem("locale", v);
            setLocale(v);
          }
        },
        LanguageFiles
      }}
    >
      {children}
    </TranslateContext.Provider>
  );
};

export default TranslateProvider;
