const runConfig: any = window['runConfig' as any];

export const config = {
  githubClientId: runConfig['GITHUB_APP_CLIENT_ID'],
  githubAppName: runConfig['GITHUB_APP_NAME'],
  telemetryDisabled: runConfig['TELEMETRY_DISABLED'] === '1',
  serverUrl: process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : '',
  // If app is loaded over https, we connect with wss
  serverWsUrl: process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL.replace('http', 'ws')
    : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
        window.location.host
      }`,
  environment: process.env.NODE_ENV,
};

export const trackingGoals = {
  createDatabase: 'OHO7WM5Y',
  createAppDokku: '37GKGSE1',
  createAppGithub: 'UQPMEGEM',
};
