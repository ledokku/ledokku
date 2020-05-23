import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { appNameSchema } from '../utils';

export const deleteApp: MutationResolvers['deleteApp'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // We make sure the name is valid to avoid security risks
  appNameSchema.validateSync({ name: input.name });

  // TODO check name of the app is unique per server

  const ssh = await sshConnect();

  // We find app to delete
  const allApps = await prisma.user
    .findOne({
      where: {
        id: userId,
      },
    })
    .App();

  const appToDelete = allApps.filter((app) => app.name === input.name);

  // We find all related app builds and delete them
  const allAppBuilds = await prisma.user
    .findOne({
      where: {
        id: userId,
      },
    })
    .AppBuild();

  const appBuildToDelete = allAppBuilds.filter(
    (appBuild) => appBuild.appId === appToDelete[0].id
  );

  await prisma.appBuild.deleteMany({
    where: {
      id: appBuildToDelete[0].id,
    },
  });

  // TODO @arturs : check this issue and if cascade feature is delivered by prisma
  // implement it instead of looking for related fields "manually"
  // Link to GH issue : https://github.com/prisma/migrate/issues/249

  // We delete the app itself
  await prisma.app.delete({
    where: {
      id: appToDelete[0].id,
    },
  });

  await dokku.apps.deleteApp(ssh, input.name);

  return { result: `${appToDelete[0].name} app deleted successfully` };
};
