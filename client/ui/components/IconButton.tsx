import { Button, NormalColors } from '@nextui-org/react';
import { ReactNode } from 'react';

interface IconButtonProps {
    icon: ReactNode;
    color?: NormalColors;
    className?: string;
}

export const IconButton = (props: IconButtonProps) => {
    return (
        <Button
            className={props.className}
            css={{ minWidth: 'fit-content' }}
            color={props.color}
            size="sm"
            icon={props.icon}
        />
    );
};
