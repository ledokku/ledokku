import { verifyWebhookSecret } from './verifyGithubSecret';
import { prisma } from '../../prisma';
import { Request } from 'express';
import { createAppAuth } from '@octokit/auth-app';
import { AppAuthentication } from '@octokit/auth-app/dist-types/types';
import { config } from '../../config';
import { deployAppQueue } from '../../queues/deployApp';

export const handleWebhooks = async (req: Request) => {
  if (!req.body) {
    throw new Error('Failed to fetch the request from github');
  }

  console.log(req.headers);

  const requestVerified = verifyWebhookSecret(req);

  if (!requestVerified) {
    throw new Error('Invalid request');
  }

  const auth = createAppAuth({
    appId: config.githubAppId,
    privateKey: config.githubAppPem,
    clientId: config.githubAppClientSecret,
    clientSecret: config.githubAppClientSecret,
  });

  const installationAuthentication = (await auth({
    type: 'installation',
    installationId: req.body.installation.id.toString(),
  })) as AppAuthentication;

  const appsToRedeploy = await prisma.appMetaGithub.findMany({
    where: {
      repoId: req.body.repository.id.toString(),
    },
  });

  for (let app of appsToRedeploy) {
    const appToRedeploy = await prisma.app.findUnique({
      where: {
        id: app.appId,
      },
    });

    await deployAppQueue.add('deploy-app', {
      appId: appToRedeploy.id,
      userName: app.repoOwner,
      token: installationAuthentication.token,
    });
  }
};
