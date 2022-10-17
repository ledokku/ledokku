import { useTheme } from "@nextui-org/react"

export const Footer = () => {
    const { theme } = useTheme();

    return <div className="w-full flex flex-row justify-center py-1" style={{ backgroundColor: theme?.colors.accents0.value }}>
        Overclock Studios SA de CV © {new Date().getFullYear()}
    </div>
}