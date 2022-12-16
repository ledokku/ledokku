"use client";

import { hasCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RedirectProps {
    route: string;
    ifAuth?: boolean;
    ifGuest?: boolean;
    setCookieOnRedirect?: [string, string];
    children?: React.ReactNode;
}

export const Redirect = (props: RedirectProps) => {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (router) {
            if (props.setCookieOnRedirect) {
                setCookie(props.setCookieOnRedirect[0], props.setCookieOnRedirect[1]);
            }


            if ((props.ifAuth === true && hasCookie("accessToken"))
                || (props.ifGuest === true && !hasCookie("accessToken"))) {
                return router.replace(props.route);
            }
        }
        setShowContent(true)
    }, [props, router])

    return <>{showContent && props.children}</>
}