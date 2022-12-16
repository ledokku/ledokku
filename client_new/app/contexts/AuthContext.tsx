"use client";

import { createContext, useContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { getCookie, removeCookies, setCookie } from 'cookies-next';

interface JwtUser {
    userId: string;
    avatarUrl: string;
    userName: string;
}

const AuthContext = createContext<{
    loggedIn: boolean;
    user?: JwtUser;
    login(token: string): void;
    logout(): void;
}>({ loggedIn: false, login: () => null, logout: () => null });

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [state, setState] = useState<{
        loggedIn: boolean;
        user?: JwtUser;
    }>(() => {
        const token = getCookie("accessToken")?.toString();

        let decodedToken;
        if (token) {
            try {
                decodedToken = jwtDecode<JwtUser>(token);
            } catch (e) { }
        }
        return {
            loggedIn: Boolean(token),
            user: decodedToken
                ? {
                    userId: decodedToken.userId,
                    avatarUrl: decodedToken.avatarUrl,
                    userName: decodedToken.userName,
                }
                : undefined,
        };
    });

    const login = (token: string) => {
        setCookie("accessToken", token)
        const decodedToken = jwtDecode<JwtUser>(token);
        setState({
            loggedIn: true,
            user: {
                userId: decodedToken.userId,
                avatarUrl: decodedToken.avatarUrl,
                userName: decodedToken.userName,
            },
        });
    };

    const logout = () => {
        removeCookies("accessToken")
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                loggedIn: state.loggedIn,
                user: state.user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
