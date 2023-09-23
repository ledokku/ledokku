import { Spinner } from "@nextui-org/react";

interface LoadingSectionProps {
  py?: number;
}

export const LoadingSection = ({ py = 64 }: LoadingSectionProps) => {
  return (
    <div
      className={`w-full h-full flex flex-row justify-center items-center`}
      style={{
        marginTop: py,
        marginBottom: py,
      }}
    >
      <Spinner />
    </div>
  );
};
