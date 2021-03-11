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
import { Logs } from './pages/app/logs';
import { Settings as AppSettings } from './pages/app/settings';
import { Database } from './pages/database/index';
import { Logs as DatabaseLogs } from './pages/database/logs';
import { Settings as DatabaseSettings } from './pages/database/settings';
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
        <PrivateRoute path="/app/:id/logs" exact>
          <Logs />
        </PrivateRoute>
        <PrivateRoute path="/database/:id" exact>
          <Database />
        </PrivateRoute>
        <PrivateRoute path="/database/:id/logs" exact>
          <DatabaseLogs />
        </PrivateRoute>
        <PrivateRoute path="/database/:id/settings" exact>
          <DatabaseSettings />
        </PrivateRoute>
        {/* TODO 404 page */}
      </Switch>
    </BrowserRouter>
  );
};
