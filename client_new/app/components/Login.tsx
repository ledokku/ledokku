"use client";

import { Button } from "@nextui-org/react";
import { GITHUB_APP_CLIENT_ID } from "../constants";

export const Login = () => {
    const handleLogin = () => {
        window.location.replace(
            `https://github.com/login/oauth/authorize?client_id=${GITHUB_APP_CLIENT_ID}&state=github_login`
        );
    };

    return <Button
        onClick={handleLogin}
        color="gradient"
        shadow
        size="lg">
        Iniciar sesión con Github
    </Button>;
}