import React from "react"
import { BsClipboard } from "react-icons/bs";

export const CodeCopy = ({ children, className }: { children: React.ReactNode, className: string }) => {
    return <div className={`${className} bg-gray-800 text-white font-mono rounded-lg px-4 py-2 overflow-hidden break-words`}>
        <div className="float-right bg-white hover:bg-gray-200 cursor-pointer p-2 rounded">
            <BsClipboard color="black" />
        </div>
        {children}
    </div>
}