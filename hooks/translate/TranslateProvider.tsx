/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import { hu } from "@/locales/hu.lang";
import { en } from "@/locales/en.lang";
import React, { useEffect, useState } from "react";
import { TranslateContext } from "./TranslateContext";
import { Language } from "@/locales/lang";


// The Languages array holds every language, 
// in this way it is easier to define the currLang state in the provider
// since with keyof it automatically gets the keys of the object.
const Languages = {
  hu,
  en
}

type LanguagesType = keyof typeof Languages;

type Props = {
  children: React.ReactNode
}

//Props are not needed, we only need the children from PropsWithChildren
const TranslateProvider: NextPage<Props> = ({ children }: Props) => {
  const [currLang, setCurrLang] = useState<LanguagesType>("hu");
  const [selectedLang, setSelectedLang] = useState<Language>()
  let didInit = false
  
  // The function assumes that the only languages available to pick is Hungarian or English.
  // For future use, it maybe useful to extend this function, so it will be able to change the language dynamically
  const changeLang = (str: LanguagesType) => {
    setCurrLang(str)
    localStorage.setItem("lang", str)
  }

  useEffect(() => {
    setSelectedLang(Languages[currLang])
  }, [currLang])

  //Automatically loads in the current langauge.
  useEffect(() => {
    if (didInit) return
    didInit = true
    const storedLang = localStorage.getItem("lang")
    if (storedLang) changeLang(storedLang as LanguagesType);
    else {
      const lang: string = navigator.language;
      const langNew: string = lang.slice(0, 2);
      if (Object.keys(Languages).includes(langNew)) {
        changeLang(langNew as LanguagesType);
      }
    }

    

    /*
    For safekeeping if somehow the above code breaks in someway.

    switch(localStorage.getItem("lang") as LanguagesType){
      case "en": 
        setCurrLang("en");
        break;
      case "hu":
        setCurrLang("hu");
        break;
    }
    
    */
  },[])

  if (!selectedLang) return null

  return (
    <TranslateContext.Provider
      value={{
        changeLang,
        lang: selectedLang,
        currLang
      }}
    >
      {children}
    </TranslateContext.Provider>
  );
};

export default TranslateProvider;
