import CustomScrollBar from "@/comp/Scrollbar"
import AuthProvider from "./AuthProvider"
import FloatingMessageWrapper from "./FloatingMessageWrapper"
import TranslateProvider from "./translate/TranslateProvider"

interface Props {
    children: React.ReactNode
}

const MainProvider = ({children}: Props) => {
    return (
        <CustomScrollBar>
            <TranslateProvider>
                <FloatingMessageWrapper>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </FloatingMessageWrapper>
            </TranslateProvider>
        </CustomScrollBar>
    );
}

export default MainProvider