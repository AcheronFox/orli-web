import { useContext } from "react";
import { TranslateContext } from "./TranslateContext";

const useTranslate = () => {
    const translate = useContext(TranslateContext);
    return translate
}

export default useTranslate