/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import hu from "@/locales/hu/hu.lang";
import en from "@/locales/en/en.lang";
import React, { useEffect, useState } from "react";
import { TranslateContext } from "./TranslateContext";

const Languages = {
  hu,
  en
}

export type LanguagesType = keyof typeof Languages;
type Props = {
  children: React.ReactNode
}

const TranslateProvider: NextPage<Props> = ({ children }: Props) => {
  const [currLang, setCurrLang] = useState<LanguagesType>("hu");
  const [selectedLang, setSelectedLang] = useState<Language>()
  let didInit = false
  
  const changeLangLocal = (str: LanguagesType) => {
    setSelectedLang(Languages[str])
    setCurrLang(str)
    localStorage.setItem("locale", str)
  }

  useEffect(() => {
    if (didInit) return
    didInit = true
    const storedLang = localStorage.getItem("locale")

    if (storedLang) changeLangLocal(storedLang as LanguagesType);
    else {
      const lang: string = navigator.language;
      const langNew: string = lang.slice(0, 2);
      if (Object.keys(Languages).includes(langNew)) {
        changeLangLocal(langNew as LanguagesType);
      }
    }
  }, [])


  if (!selectedLang) return null
  return (
    <TranslateContext.Provider
      value={{
        changeLang: (v: LanguagesType) => changeLangLocal(v) ,
        lang: selectedLang,
        currLang: currLang
      }}
    >
      {children}
    </TranslateContext.Provider>
  );
};

export default TranslateProvider;
