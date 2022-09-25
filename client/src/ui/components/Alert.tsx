import { Card, Text } from "@nextui-org/react";
import { LightenDarkenColor } from "../../utils/colors";

interface AlertProps {
    title?: string,
    message: string
    type: "success" | "error" | "warning" | "info",
    className?: string
}

export const Alert = ({ message, title, type, className }: AlertProps) => {
    let color = "#0072F5"

    switch (type) {
        case "error":
            color = "#F31260"
            break;
        case "info":
            color = "#0072F5"
            break;
        case "success":
            color = "#17C964"
            break;
        case "warning":
            color = "#F5A524"
            break;
    }

    const bgColor = LightenDarkenColor(color, 180)
    const textColor = LightenDarkenColor(color, -80)

    return (<div className={`w-156 ${className}`} >
        <Card variant="flat" css={{ bgColor: bgColor, borderColor: color, borderWidth: 2 }}>
            <Card.Body>
                <Text h4 color={textColor}>{title}</Text>
                <Text color={textColor}>{message}</Text>
            </Card.Body>
        </Card>
    </div>);
}