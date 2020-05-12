import * as yup from 'yup';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { buildAppQueue } from '../../queues/buildApp';
import { sshConnect } from '../../lib/ssh';

// Validate the name to make sure there are no security risks by adding it to the ssh exec command.
// Only letters and "-" allowed
// TODO unit test this schema
const createAppSchema = yup.object({
  name: yup
    .string()
    .required()
    .matches(/^[a-z0-9-]+$/),
});

export const createApp: MutationResolvers['createApp'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // We make sure the name is valid to avoid security risks
  createAppSchema.validateSync({ name: input.name });

  // TODO check name of the app is unique per server

  const ssh = await sshConnect();

  await dokku.apps.create(ssh, input.name);

  const app = await prisma.app.create({
    data: {
      name: input.name,
      githubRepoUrl: input.gitUrl,
      githubId: 'TODO',
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  const appBuild = await prisma.appBuild.create({
    data: {
      status: 'PENDING',
      user: {
        connect: {
          id: userId,
        },
      },
      app: {
        connect: {
          id: app.id,
        },
      },
    },
  });

  // We trigger the queue that will add dokku to the server
  await buildAppQueue.add('build-app', { buildId: appBuild.id });

  return { app, appBuild };
};
