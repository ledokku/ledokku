import fetch from 'node-fetch';
import { Octokit } from '@octokit/rest';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../config';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const loginWithGithub: MutationResolvers['loginWithGithub'] = async (
  _,
  { code }
) => {
  let data:
    | {
        error: string;
        error_description: string;
      }
    | {
        access_token: string;
        token_type: string;
        scope: string;
      };
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.githubClientId,
        client_secret: config.githubClientSecret,
        code,
      }),
    });
    data = await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('Request failed');
  }

  if ('error' in data) {
    console.error(data);
    throw new Error(data.error_description);
  }

  const octokit = new Octokit({
    auth: data.access_token,
  });

  // We fetch the user informations
  const { data: githubUser } = await octokit.users.getAuthenticated();

  let user = await prisma.user.findOne({
    where: { githubId: githubUser.node_id },
  });

  // User not found it means we are creating a new user
  if (!user) {
    // We limit to only one user per server for now
    // This can be fixed later by allowing user to invite other users for example
    const nbUsers = await prisma.user.count();
    if (nbUsers >= 1) {
      throw new Error('Unauthorized');
    }

    // We fetch the user private emails
    const { data: emails } = await octokit.users.listEmailsForAuthenticated();
    // Github return an array of emails, we just need the primary email
    const email = emails.find((email) => email.primary);

    user = await prisma.user.create({
      data: {
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        email: email.email,
        githubAccessToken: data.access_token,
        githubId: githubUser.node_id,
      },
    });
  }

  const jwtToken = jsonwebtoken.sign(
    { userId: user.id, avatarUrl: user.avatarUrl },
    config.jwtSecret,
    {
      expiresIn: '1d',
    }
  );

  return { token: jwtToken };
};
