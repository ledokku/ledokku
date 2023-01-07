import { DbTypes } from '@prisma/client';

export const dbTypeToDokkuPlugin = (dbType: DbTypes): string => {
  switch (dbType) {
    case DbTypes.MONGODB:
      return 'mongo';
    case DbTypes.POSTGRESQL:
      return 'postgres';
    case DbTypes.REDIS:
      return 'redis';
    case DbTypes.MYSQL:
      return 'mysql';
    case DbTypes.MARIADB:
      return 'mariadb';
  }
};

// export const refreshAuthToken = async (userId: string) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//     select: {
//       refreshToken: true,
//     },
//   });

//   const app = new OAuthApp({
//     clientType: 'github-app',
//     clientId: config.githubAppClientId,
//     clientSecret: config.githubAppClientSecret,
//   });

//   const { data } = await app.refreshToken({
//     refreshToken: user.refreshToken,
//   });

//   const rn = new Date();
//   const time = rn.getTime();
//   const refreshTokenExpiresAt = new Date(time + data.refresh_token_expires_in);

//   await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       refreshToken: data.refresh_token,
//       refreshTokenExpiresAt,
//       githubAccessToken: data.access_token,
//     },
//   });

//   return data.access_token;
// };

// // All the commented out files could be helpful
// // TODO FIX TYPES : https://github.com/ledokku/ledokku/issues/371
// // type InstallationParams = Endpoints['GET /user/installations'];
// type InstallationsResponse = Endpoints['GET /user/installations']['response'];

// export const octoRequestWithUserToken = async (
//   requestData: string,
//   // requestData: InstallationParams['request'],
//   userGithubAccessToken: string,
//   userId: string
// ) => {
//   const octokit = new Octokit({
//     auth: userGithubAccessToken,
//   });

//   // let res: InstallationsResponse;

//   // type OctoResponse = GetResponseTypeFromEndpointMethod<typeof octokit.request>;

//   let res: any;

//   try {
//     res = await octokit.request(requestData);
//     // res = (await octokit.request(
//     //   requestData as InstallationParams['request']
//     // )) as InstallationsResponse;
//   } catch (e) {
//     if (e.message === 'Bad credentials') {
//       userGithubAccessToken = await refreshAuthToken(userId);
//     }

//     const octokit = new Octokit({
//       auth: userGithubAccessToken,
//     });

//     res = (await octokit.request(requestData)) as InstallationsResponse;
//   }
//   return res;
// };
