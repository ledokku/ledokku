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
import { App } from './pages/app/index';
import { Env } from './pages/app/env';
import { Databases } from './pages/app/databases';
import { Settings as AppSettings } from './pages/app/settings';
import { Dashboard } from './pages/dashboard';
import { Activity } from './pages/activity';
import { Metrics } from './pages/metrics';
import { Settings } from './pages/settings';
import { CreateDatabase } from './pages/create-database';
import { CreateApp } from './pages/create-app';

const PrivateRoute = ({ children, ...rest }: RouteProps) => {
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
        <PrivateRoute path="/activity" exact>
          <Activity />
        </PrivateRoute>
        <PrivateRoute path="/metrics" exact>
          <Metrics />
        </PrivateRoute>
        <PrivateRoute path="/settings" exact>
          <Settings />
        </PrivateRoute>
        <PrivateRoute path="/create-app" exact>
          <CreateApp />
        </PrivateRoute>
        <PrivateRoute path="/create-database" exact>
          <CreateDatabase />
        </PrivateRoute>
        <PrivateRoute path="/app/:id" exact>
          <App />
        </PrivateRoute>
        <PrivateRoute path="/app/:id/env" exact>
          <Env />
        </PrivateRoute>
        <PrivateRoute path="/app/:id/settings" exact>
          <AppSettings />
        </PrivateRoute>
        <PrivateRoute path="/app/:id/databases" exact>
          <Databases />
        </PrivateRoute>
        {/* TODO 404 page */}
      </Switch>
    </BrowserRouter>
  );
};
