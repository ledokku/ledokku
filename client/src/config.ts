export const config = window['runConfig']
  ? {
      githubClientId: window['runConfig']['GITHUB_CLIENT_ID'],
      serverUrl: '',
    }
  : {
      githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      serverUrl: process.env.REACT_APP_SERVER_URL,
    };
