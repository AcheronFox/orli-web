import { useContext } from "react";
import { NotificationContext} from "./NotificationContext";

const useNotification = () => {
    const translate = useContext(NotificationContext);
    return translate
}

export default useNotification