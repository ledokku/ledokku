const runConfig: any = window['runConfig' as any];

export const config = runConfig
  ? {
      githubClientId: runConfig['GITHUB_CLIENT_ID'],
      serverUrl: '',
      environment: process.env.NODE_ENV,
    }
  : {
      githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      serverUrl: process.env.REACT_APP_SERVER_URL,
      environment: process.env.NODE_ENV,
    };
