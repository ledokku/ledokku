export const config = window['runConfig']
  ? {
      githubClientId: window['runConfig']['GITHUB_CLIENT_ID'],
      serverUrl: '',
      environment: process.env.NODE_ENV,
    }
  : {
      githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      serverUrl: process.env.REACT_APP_SERVER_URL,
      environment: process.env.NODE_ENV,
    };
