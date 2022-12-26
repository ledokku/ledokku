import { Loading } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const UrlStatus = ({ url }: { url: string }) => {
    const [status, setStatus] = useState<number | undefined>();

    useEffect(() => {
        fetch(url, { method: "GET" }).then(res => setStatus(res.status)).catch(err => console.log(err));
    })

    return !status ? <Loading size="sm" /> : <div className="flex flex-row items-center">
        <div className={`w-3 h-3 rounded-full ${status === 200 ? "bg-green-500" : "bg-red-500"}`} />
        <span className="ml-2">{status === 200 ? "Correcto" : `Error ${status}`}</span>
    </div>
}