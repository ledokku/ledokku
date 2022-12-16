"use client";

import { Text } from "@nextui-org/react";
import { CodeCopy } from "./CodeCopy";

export const CantConectSshScreen = ({ sshKey }: { sshKey: string }) => {
    return <div className="">
        <Text className="mt-4">
            Para conectarse por SSH, ejecuta el siguiente comando en tu servidor de
            Dokku.
        </Text>
        <CodeCopy className="md:w-[700px] w-screen">
            {`echo "${sshKey}" | dokku ssh-keys:add ledokku`}
        </CodeCopy>
        <Text className="mt-3">Una vez finalizado, refresca la página.</Text>
    </div>
}