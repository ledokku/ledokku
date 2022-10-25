export const SERVER_URL: string =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000/";

export const SERVER_WS_URL = SERVER_URL.replace('http', 'ws');

export const GITHUB_APP_CLIENT_ID =
  process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID;
export const GITHUB_APP_NAME = process.env.NEXT_PUBLIC_GITHUB_APP_NAME;
export const TELEMETRY_DISABLED =
  process.env.NEXT_PUBLIC_TELEMETRY_DISABLED === '1';
export const NODE_ENV = process.env.NODE_ENV;

export const trackingGoals = {
  createDatabase: 'OHO7WM5Y',
  createAppDokku: '37GKGSE1',
  createAppGithub: 'UQPMEGEM',
};
