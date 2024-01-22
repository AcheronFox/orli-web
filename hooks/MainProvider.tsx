import CustomScrollBar from "@/comp/Scrollbar"
import FloatingMessageWrapper from "./FloatingMessageWrapper"
import TranslateProvider from "./translate/TranslateProvider"
import UserProvider from "./user/UserProvider"

interface Props {
    children: React.ReactNode
}

const MainProvider = ({children}: Props) => {
    return (
        <CustomScrollBar>
            <TranslateProvider>
                <FloatingMessageWrapper>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </FloatingMessageWrapper>
            </TranslateProvider>
        </CustomScrollBar>
    );
}

export default MainProvider