import { hu } from "./hu.lang"
import { en } from "./en.lang"

type GenerateLanguageType<T> = {
  [K in keyof T & string as T[K] extends string ? K : never]: string
}

type Language = GenerateLanguageType<typeof hu & typeof en> 