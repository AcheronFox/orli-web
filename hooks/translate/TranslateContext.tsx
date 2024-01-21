import { createContext } from "react"
import hu from "@/locales/hu.lang";

interface ITranslateContext {
    changeLang: (v: any) => void,
    lang: Language,
    currLang: string
}

//Sets the default values for the context
export const TranslateContext = createContext<ITranslateContext>({
  changeLang: () => {}, currLang: "hu", lang: hu
})
