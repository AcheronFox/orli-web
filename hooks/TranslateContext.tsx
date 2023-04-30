import { createContext } from "react";

export const TranslateContext = createContext({
  shouldChange: false,
  setShouldChange: (v:boolean) => {},
  locale: "",
  changeLocale: (v:string) => {},
  LanguageFiles: Object(),
  isReady: Boolean(),
});
