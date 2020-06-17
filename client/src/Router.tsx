import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import { useAuth } from './modules/auth/AuthContext';
import { Home } from './pages/home';
import { Dashboard } from './pages/dashboard';

export const PrivateRoute = ({ children, ...rest }: RouteProps) => {
  const { loggedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <PrivateRoute path="/dashboard" exact>
          <Dashboard />
        </PrivateRoute>
        {/* TODO 404 page */}
      </Switch>
    </BrowserRouter>
  );
};
