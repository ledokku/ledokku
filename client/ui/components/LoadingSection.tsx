import { Loading, LoadingProps } from '@nextui-org/react';

interface LoadingSectionProps {
    py?: number,
    type?: LoadingProps["type"]
}

export const LoadingSection = ({ py = 64, type }: LoadingSectionProps) => {
    return (
        <div className={`w-full py-${py} flex flex-row justify-center items-center`}>
            <Loading type={type} />
        </div>
    );
};
