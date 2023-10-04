import { BuildEnvVar } from "@/generated/graphql";
import { useState } from "react";

interface UseOpenEnvFileOptions {
  onRead?: (envVars: BuildEnvVar[]) => void;
  onError?: (error: string) => void;
}

export function useOpenEnvFile({
  onRead,
  onError,
}: UseOpenEnvFileOptions = {}) {
  const [loading, setLoading] = useState(false);

  const handleOpenEnvFile = (files: FileList) => {
    if (!files || files.length !== 1)
      return onError?.("Solo se puede subir un archivo");

    setLoading(true);

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const contents = (e.target?.result as string) ?? "";

      const lines = contents.split("\n");

      onRead?.(
        lines
          .filter((it) => it.includes("=") && !it.startsWith("#"))
          .map((line) => {
            const values = line.split("=");
            return {
              key: values[0],
              value: values.slice(1).join("=").trim(),
            };
          })
      );
      setLoading(false);
    };

    fileReader.onerror = (e) => {
      onError?.(e.toString());
      setLoading(false);
    };

    fileReader.onabort = () => {
      onError?.("Se canceló la carga del archivo");
      setLoading(false);
    };

    fileReader.readAsText(files[0]);
  };

  return {
    loading,
    openEnvFile: handleOpenEnvFile,
  };
}
