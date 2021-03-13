const runConfig: any = window['runConfig' as any];

export const config = runConfig
  ? {
      githubClientId: runConfig['GITHUB_CLIENT_ID'],
      telemetryDisabled: runConfig['TELEMETRY_DISABLED'],
      serverUrl: '',
      // If app is loaded over https, we connect with wss
      serverWsUrl: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
        window.location.host
      }`,
      environment: process.env.NODE_ENV,
    }
  : {
      githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      telemetryDisabled: true,
      serverUrl: process.env.REACT_APP_SERVER_URL,
      serverWsUrl: process.env.REACT_APP_SERVER_URL?.replace('http', 'ws'),
      environment: process.env.NODE_ENV,
    };

export const trackingGoals = {
  createDatabase: 'OHO7WM5Y',
  createApp: '37GKGSE1',
};
