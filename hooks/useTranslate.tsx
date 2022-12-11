import React, { useContext, useEffect, useState } from "react";
import { i18n } from "../i18n";
import { TranslateContext } from "./TranslateContext";

export const useTranslate = () => {

  const { shouldChange, setShouldChange, locale, changeLocale, LanguageFiles, isReady } = useContext(TranslateContext);

  const changeLanguage = (localeArg: string) => {
    changeLocale(localeArg)
  };

  const t = (key: string): string => {
    return LanguageFiles[locale][key] ?? key;
  };

  const ts = (key: string): object[] | (()=>object[]) => {
    return LanguageFiles[locale][key] ?? key;
  };

  const processed = () => {
    return isReady;
  }

  return { t, ts, locale, processed, changeLanguage };
};
