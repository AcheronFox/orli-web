import CustomScrollBar from "@/comp/Scrollbar"
import TranslateProvider from "./translate/TranslateProvider"
import UserProvider from "./user/UserProvider"
import NotificationProvider from "./notification/NotificationProvider"

interface Props {
    children: React.ReactNode
}

const MainProvider = ({children}: Props) => {
    return (
        <TranslateProvider>
            <NotificationProvider>
                <UserProvider>
                    <CustomScrollBar>
                        {children}
                    </CustomScrollBar>
                </UserProvider>
            </NotificationProvider>
        </TranslateProvider>
    );
}

export default MainProvider