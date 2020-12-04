const runConfig: any = window['runConfig' as any];

export const config = runConfig
  ? {
      githubClientId: runConfig['GITHUB_CLIENT_ID'],
      serverUrl: '',
      serverWsUrl: `ws://${window.location.host}`,
      environment: process.env.NODE_ENV,
    }
  : {
      githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      serverUrl: process.env.REACT_APP_SERVER_URL,
      serverWsUrl: process.env.REACT_APP_SERVER_URL?.replace('http', 'ws'),
      environment: process.env.NODE_ENV,
    };
