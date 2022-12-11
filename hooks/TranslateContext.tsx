import React, { createContext } from "react";
import { i18n } from "../i18n";

export const TranslateContext = createContext({
  shouldChange: false,
  setShouldChange: (v:boolean) => {},
  locale: "",
  changeLocale: (v:string) => {},
  LanguageFiles: Object(),
  isReady: Boolean(),
});
