import { Container, Image } from "@nextui-org/react"
import { ReactNode } from "react"
import useDarkMode from "use-dark-mode";
import { Header } from "../components/Header"

interface AdminLayoutProps {
    children?: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const darkMode = useDarkMode(false);

    return <>
        <div className="blur-3xl absolute w-full" style={{ zIndex: -10 }}>
            <Image src={darkMode.value ? "/bg_dark.jpg" : "/bg_light.jpg"} height="20vh" objectFit="cover" />
        </div>
        <Header />
        <Container className="py-16" id="container-up">
            {children}
        </Container>
    </>
}