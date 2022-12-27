import { Loading } from '@nextui-org/react';

interface LoadingSectionProps {
    py?: `py-${number}`
}

export const LoadingSection = ({ py = "py-64" }: LoadingSectionProps) => {
    return (
        <div className={`w-full ${py} flex flex-row justify-center items-center`}>
            <Loading />
        </div>
    );
};
