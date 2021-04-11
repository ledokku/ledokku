import { readFileSync, writeFileSync } from 'fs';
import { config } from './../config';
import { sshConnect } from './../lib/ssh';
import { dokku } from './../lib/dokku';
import { Request } from 'express';

export const githubInstallationIdHandler = async (req: Request) => {
  const githubInstallationId = req.body.installation.id;

  if (process.env.NODE_ENV === 'production') {
    // In production we add this config as dokku config for the ledokku app.
    // The no-restart option is used as we do not need to reboot the ledokku server.
    const ssh = await sshConnect();

    await dokku.config.set(
      ssh,
      'ledokku',
      [{ key: 'GITHUB_APP_INSTALLATION_ID', value: githubInstallationId }],
      { noRestart: true }
    );

    ssh.dispose();
  } else {
    // In dev mode we want to add these variables to the .env local file.
    const dotenvPath = `${process.cwd()}/.env`;
    let dotenvData = readFileSync(dotenvPath, {
      encoding: 'utf8',
    });

    dotenvData += `\nGITHUB_APP_INSTALLATION_ID="${githubInstallationId}"`;
    writeFileSync(dotenvPath, dotenvData, { encoding: 'utf8' });
    console.log(`Github application config added to .env file.`);
  }

  // Add the config to the current runtime config so we don't have to restart the server
  config.githubAppInstallationId = githubInstallationId;
};
