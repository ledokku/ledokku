"use client";

import { useSetupQuery } from "@/generated/graphql";
import { PageProps } from "@/types/next";
import { OCStudiosLogo } from "@/ui/icons/OCStudiosLogo";
import { Button, Snippet, Spinner } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiGithub } from "react-icons/fi";

export default function Index(props: PageProps) {
  const { data, loading } = useSetupQuery();
  const { status } = useSession();
  const {replace} = useRouter()

  if(status === "authenticated"){
    return replace("/dashboard")
  }

  const loginError = props.searchParams.error as string | undefined;
  const stringDividedEvery100Chars =
    `echo "${data?.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`.match(
      /.{1,50}/g
    );

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col justify-center relative">
        <div className="mb-6 mx-auto">
          <OCStudiosLogo size={150} />
        </div>
        {loading && <Spinner />}

        {loginError && (
          <p className="mt-4 text-red-500 text-center">{loginError}</p>
        )}

        {data?.setup?.canConnectSsh === false && (
          <div className="max-w-lg flex flex-col justify-center gap-2">
            <p className="mt-4">
              Para conectarse por SSH, ejecuta el siguiente comando en tu
              servidor de Dokku.
            </p>
            <Snippet
              className="max-w-lg"
              hideSymbol
              codeString={`echo "${data?.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
            >
              {stringDividedEvery100Chars?.map((it, index) => (
                <span key={index}>{it}</span>
              ))}
            </Snippet>
            <p className="mt-3">Una vez finalizado, refresca la página.</p>
          </div>
        )}

        {data?.setup?.canConnectSsh && data?.setup.isGithubAppSetup && (
          <div className="flex flex-col justify-center items-center">
            <Button
              className="mt-4"
              onClick={() => signIn("github", {
                callbackUrl: "/dashboard",
                redirect: true
              })}
              startContent={<FiGithub size={18} />}
              size="lg"
              color="primary"
              variant="shadow"
              isLoading={status === "loading"}
            >
              &nbsp; Iniciar sesión con Github
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
