import { Spinner } from "@nextui-org/react";

interface LoadingSectionProps {
  py?: number;
}

export const LoadingSection = ({ py = 64 }: LoadingSectionProps) => {
  return (
    <div
      className={`w-full h-full py-${py} flex flex-row justify-center items-center`}
    >
      <Spinner />
    </div>
  );
};
