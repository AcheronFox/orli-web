import React, { createContext } from "react"
import { hu } from "@/locales/hu.lang";
import { Language } from "@/locales/lang";

// This interface is for defining the context. 
// changeLang changes the language, 
// and sets the localstorage value for the current language to automaticly set the language.
//
// lang is the current language object, it's automatically Hungarian until changed.
//
// currLang is the key of the current lang for the ease of use for other objects. 


interface ITranslateContext {
    changeLang: (v: any) => void,
    lang: Language,
    currLang: string
}

//Sets the default values for the context
export const TranslateContext = createContext<ITranslateContext>({
  changeLang: () => {}, currLang: "hu", lang: hu
})
