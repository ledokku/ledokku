import { Spinner } from "@nextui-org/react";
import { useCheckDomainStatusQuery } from "../../../generated/graphql";

export const UrlStatus = ({ url }: { url: string }) => {
  const { data, loading, error } = useCheckDomainStatusQuery({
    variables: {
      url,
    },
  });

  const status = data?.checkDomainStatus;

  return loading ? (
    <Spinner size="sm" />
  ) : (
    <div className="flex flex-row items-center">
      <div
        className={`w-3 h-3 rounded-full ${
          status && status >= 200 && status < 400 && !error
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />
      <span className="ml-2">
        {status && status >= 200 && status < 400
          ? "Correcto"
          : `${status ?? "Incorrecto"}`}
      </span>
    </div>
  );
};
