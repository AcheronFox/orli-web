import { useContext } from "react";
import { NotificationContext} from "./NotificationContext";

const useNotification = () => {
    const notif = useContext(NotificationContext);
    return notif
}

export default useNotification