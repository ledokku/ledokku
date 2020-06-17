import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { Home } from './pages/home';

export const PrivateRoute = ({ children, ...rest }) => {
  return null;
  //   return (
  //     <Route
  //       {...rest}
  //       render={({ location }) =>
  //         fakeAuth.isAuthenticated ? (
  //           children
  //         ) : (
  //           <Redirect
  //             to={{
  //               pathname: '/login',
  //               state: { from: location },
  //             }}
  //           />
  //         )
  //       }
  //     />
  //   );
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/dashboard" exact>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
