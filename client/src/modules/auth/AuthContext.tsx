import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';

interface JwtUser {
  userId: string;
  avatarUrl: string;
}

const AuthContext = React.createContext<{
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
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode<JwtUser>(token) : undefined;
    return {
      loggedIn: Boolean(token),
      user: decodedToken
        ? {
            userId: decodedToken.userId,
            avatarUrl: decodedToken.avatarUrl,
          }
        : undefined,
    };
  });

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    const decodedToken = jwtDecode<JwtUser>(token);
    setState({
      loggedIn: true,
      user: {
        userId: decodedToken.userId,
        avatarUrl: decodedToken.avatarUrl,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
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

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
