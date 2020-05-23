import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';

export const deleteApp: MutationResolvers['deleteApp'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { appId } = input;

  // TODO check name of the app is unique per server

  // We find app to delete
  const appToDelete = await prisma.app.findOne({
    where: {
      id: appId,
    },
  });

  if (!appToDelete) {
    throw new Error(`App with id : ${appId} was not found`);
  }

  const ssh = await sshConnect();

  // We find and delete all the related app builds
  const allAppBuilds = await prisma.user
    .findOne({
      where: {
        id: userId,
      },
    })
    .AppBuild();

  const appBuildToDelete = allAppBuilds.filter(
    (appBuild) => appBuild.appId === appToDelete.id
  );

  await prisma.appBuild.delete({
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
      id: appId,
    },
  });

  const result = await dokku.apps.destroy(ssh, appToDelete.name);

  return { result };
};
