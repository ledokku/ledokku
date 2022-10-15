export const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const SERVER_WS_URL = SERVER_URL
  ? SERVER_URL.replace('http', 'ws')
  : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
      window.location.host
    }`;
export const GITHUB_APP_CLIENT_ID = process.env.REACT_APP_GITHUB_APP_CLIENT_ID;
export const GITHUB_APP_NAME = process.env.REACT_APP_GITHUB_APP_NAME;
export const TELEMETRY_DISABLED =
  process.env.REACT_APP_TELEMETRY_DISABLED === '1';
export const NODE_ENV = process.env.NODE_ENV;

export const trackingGoals = {
  createDatabase: 'OHO7WM5Y',
  createAppDokku: '37GKGSE1',
  createAppGithub: 'UQPMEGEM',
};
