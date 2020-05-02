import React, { useState } from 'react';

const AuthContext = React.createContext<{
  loggedIn: boolean;
  login(token: string): void;
  logout(): void;
}>({ loggedIn: false, login: () => null, logout: () => null });

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<{
    loggedIn: boolean;
  }>({
    loggedIn:
      typeof window === 'undefined'
        ? false
        : Boolean(localStorage?.getItem('accessToken')),
  });

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setState({ loggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ loggedIn: state.loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
