import CustomScrollBar from "@/comp/Scrollbar"
import FloatingMessageWrapper from "./FloatingMessageWrapper"
import TranslateProvider from "./translate/TranslateProvider"
import UserProvider from "./user/UserProvider"

interface Props {
    children: React.ReactNode
}

const MainProvider = ({children}: Props) => {
    return (
        <TranslateProvider>
            <FloatingMessageWrapper>
                <UserProvider>
                    <CustomScrollBar>
                        {children}
                    </CustomScrollBar>
                </UserProvider>
            </FloatingMessageWrapper>
        </TranslateProvider>
    );
}

export default MainProvider