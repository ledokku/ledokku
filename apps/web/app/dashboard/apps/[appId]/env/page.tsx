"use client";

import {
  EnvVarsDocument,
  useEnvVarsQuery,
  useSetEnvVarMutation,
  useUnsetEnvVarMutation,
} from "@/generated/graphql";
import { PageProps } from "@/types/next";
import { EnvForm } from "@/ui/components/forms/EnvForm";
import { LoadingSection } from "@/ui/components/misc/LoadingSection";
import { Divider, Link } from "@nextui-org/react";
import toast from "react-hot-toast";

export default function EnvsPage({ params }: PageProps) {
  const [unsetEnvVarMutation] = useUnsetEnvVarMutation();
  const [setEnvVarMutation] = useSetEnvVarMutation();
  const { data, loading } = useEnvVarsQuery({
    variables: {
      appId: params.appId,
    },
    pollInterval: 1000,
  });
  return (
    <>
      <div className="my-6">
        <h3>Configurar variables de entorno</h3>
        <div>
          Las variables de entorno cambian la manera en la que la aplicación se
          comporta. Estan disponibles tanto en tiempo de ejecución como en
          compilación para lanzamientos basados en buildpack.{" "}
          <Link
            href="https://dokku.com/docs/configuration/environment-variables/"
            isExternal
          >
            Leer más
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <EnvForm
          key="newVar"
          name=""
          value=""
          asBuildArg={false}
          isNewVar={true}
          onSubmit={async (values) => {
            try {
              await setEnvVarMutation({
                variables: {
                  input: {
                    key: values.name,
                    value: values.value,
                    appId: params.appId,
                    asBuildArg: values.asBuildArg,
                  },
                },
                refetchQueries: [
                  {
                    query: EnvVarsDocument,
                    variables: { appId: params.appId },
                  },
                ],
              });

              toast.success("Variable de entorno asignada");
            } catch (error: any) {
              toast.error(error.message);
            }
          }}
        />
        {loading && <LoadingSection />}
        {data?.envVars.envVars.map((envVar, index) => {
          return (
            <>
              <Divider className="my-4" />
              <EnvForm
                key={envVar.key}
                name={envVar.key}
                value={envVar.value}
                asBuildArg={envVar.asBuildArg}
                onSubmit={async (values) => {
                  try {
                    await setEnvVarMutation({
                      variables: {
                        input: {
                          key: values.name,
                          value: values.value,
                          asBuildArg: values.asBuildArg,
                          appId: params.appId,
                        },
                      },
                      refetchQueries: [
                        {
                          query: EnvVarsDocument,
                          variables: { appId: params.appId },
                        },
                      ],
                    });
                    toast.success("Variable de entorno asignada");
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }}
                onDelete={async () => {
                  try {
                    await unsetEnvVarMutation({
                      variables: { key: envVar.key, appId: params.appId },
                      refetchQueries: [
                        {
                          query: EnvVarsDocument,
                          variables: { appId: params.appId },
                        },
                      ],
                    });
                    toast.success("Variable de entorno eliminada");
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
