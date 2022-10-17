import { createContext, useContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { isServer } from '../../../utils/utils';

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
    const token = !isServer() ? localStorage.getItem('accessToken') : undefined;

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
    localStorage.setItem('accessToken', token);
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

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
