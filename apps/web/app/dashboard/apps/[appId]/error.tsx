"use client";

import { ApolloError } from "@apollo/client";
import { Button } from "@nextui-org/react";
import { FiRefreshCw } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: ApolloError;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full">
      <h2>Error al cargar la aplicación</h2>
      <p>
        Ha ocurrido un error al cargar la aplicación. Por favor, inténtelo de
        nuevo.
      </p>
      <Button
        startContent={<FiRefreshCw />}
        color="primary"
        onClick={() => reset()}
      >
        Volver a intentar
      </Button>
    </div>
  );
}
