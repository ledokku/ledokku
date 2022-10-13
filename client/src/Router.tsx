import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { useAuth } from './modules/auth/AuthContext';
import { NotFoundPage } from './pages/404';
import { Activity } from './pages/activity';
import { CreateApp } from './pages/app-creation/create-app';
import { CreateAppDokku } from './pages/app-creation/create-app-dokku';
import { CreateAppGithub } from './pages/app-creation/create-app-github';
import { Env } from './pages/app/env';
import { App } from './pages/app/index';
import { Logs } from './pages/app/logs';
import { AppSettingsAdvanced } from './pages/app/settings/advanced';
import { AppSettingsDomains } from './pages/app/settings/domains';
import { AppSettingsPorts } from './pages/app/settings/ports';
import { Apps } from './pages/apps';
import { CreateDatabase } from './pages/create-database';
import { Dashboard } from './pages/dashboard';
import { Database } from './pages/database/index';
import { Logs as DatabaseLogs } from './pages/database/logs';
import { Settings as DatabaseSettings } from './pages/database/settings';
import { Databases } from './pages/databases';
import { Home } from './pages/home';
import { Metrics } from './pages/metrics';
import { Settings } from './pages/settings';
import { AdminLayout } from './ui/layout/layout';
import { useTracking } from './utils/useTracking';

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
  useTracking();

  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <AdminLayout>
        <PrivateRoute path="/dashboard" exact>
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/apps" exact>
          <Apps />
        </PrivateRoute>
        <PrivateRoute path="/databases" exact>
          <Databases />
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
        <PrivateRoute path="/create-app-dokku" exact>
          <CreateAppDokku />
        </PrivateRoute>
        <PrivateRoute path="/create-app-github" exact>
          <CreateAppGithub />
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
        <PrivateRoute path="/app/:id/settings/ports" exact>
          <AppSettingsPorts />
        </PrivateRoute>
        <PrivateRoute path="/app/:id/settings/domains" exact>
          <AppSettingsDomains />
        </PrivateRoute>
        <PrivateRoute path="/app/:id/settings/advanced" exact>
          <AppSettingsAdvanced />
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
      </AdminLayout>
      <Route ><NotFoundPage /></Route>
    </Switch>
  );
};
