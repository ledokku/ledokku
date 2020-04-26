import React, { useState } from 'react';

const AuthContext = React.createContext<{
  loggedIn: boolean;
  login(token: string): void;
}>({ loggedIn: false, login: () => null });

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

  return (
    <AuthContext.Provider value={{ loggedIn: state.loggedIn, login }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
