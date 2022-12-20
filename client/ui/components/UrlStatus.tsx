import { Loading } from "@nextui-org/react";

export const UrlStatus = ({ status }: { status: number }) => {

    return !status ? <Loading size="sm" /> : <div className="flex flex-row items-center">
        <div className={`w-3 h-3 rounded-full ${status >= 200 && status <= 399 ? "bg-green-500" : "bg-red-500"}`} />
        <span className="ml-2">{status === 200 ? "Correcto" : `Error ${status}`}</span>
    </div>
}