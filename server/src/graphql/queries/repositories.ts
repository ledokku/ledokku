import { Repository } from './../../generated/graphql';
import fetch from 'node-fetch';
import { QueryResolvers } from '../../generated/graphql';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../config';
import { prisma } from '../../prisma';
export const repositories: QueryResolvers['repositories'] = async (
  _,
  __,
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const payload = {
    iat: Math.round(new Date().getTime() / 1000),
    exp: Math.round(new Date().getTime() / 1000 + 60),
    iss:
      process.env.NODE_ENV === 'production'
        ? config.githubAppId
        : process.env.GITHUB_APP__ID,
  };

  //TODO FIGURE OUT A WAY TO PARSE THE PEM PROPERLY
  const token = jsonwebtoken.sign(
    payload,
    `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA8eAxQSjY3qM2MjWuflZNc4IS/f+2tgLb31JCP/0g3LofAfw9
5bv5aXk4gcRB5/I0stuNLQLiP1vDUEOTKsubgNNj7ZM1DO/lbTV/Dm2kSFwQGgQp
iOt21hFm/JoeqY8S36HsPE9qV7RQBWjX6jFElFT7agKzoiC8/L9vfMBFWcFnRiMM
VH/pfN982MNMSAoquK5LLxpkW6M7zka4eUkXxd4QmXACSeRsJg+T/lfJl04+MFJm
ozSWIqp6EIBtdojqTdmyuceFRjoWyOLsK8c2uRzZcRF/uLlPaghF2sJ8KyZncAmj
f2lkdI5RW9spsxA9YWrpya8DYKOtJcLSM9wYbQIDAQABAoIBAQCmHgV17OnVLl7A
aSHoXrlexUzp6T/BDYGYhNQ/QkfZkHJPWL/iEhGfoMNwTCu/cxdCZ4s0CLD+NrWT
YHWohKHN/mC4/8sFkZUORhl2/VJA6Ame9JDaGm1JZDZI8khwx3R85qZqXVh517rF
nFX938xr21m4WxaoGLfzFj8pfJukodvK5Ga4wtVobvCvYMsdOvVpc08zjD7VKd2z
HdELMvtc8g/IFPoSErT049qmO872/F5itWtWeoUWZwiKhEKgVHHPVlb8gPn1E0i3
mqNUN6q0z47IjTAxX+UDJOK4WVsq+HI7Ia5P7PfJ1mZpjwkFInnwcPvn0EAOGumL
2gussgpBAoGBAPui7cDaBh1y7/VVOA1O0hfvKNcpRtnHRCzf5ZIj7ASZ/eBVTTtc
b18Kt8TrzwHT1BIWczqvHjpjCm1uyHPaPjqcsBl1Ere5yKeXA+mNdMMG70nn6RXu
sAhCTs/UbFaK4/pUmjNCGrd99C3IkOQpHxoVMiJhv3MbUA82Fkbo6qnFAoGBAPYR
7wsiJkSBwrRab85bwEP+g7WHJ5otq+1nGK1XLA5E4b4pA0/vvT56SaBmNUGlFhuW
5fN51p0seWnjeXM+Ifk2JlIfbgYD2nl+6HJF5YdWnfkkmc8SPAVPL49FUiJe7wEx
TI2/xi+GGY09gzOTi6c2F3hgqoclVXwFsuTqBCaJAoGADs43TvGFCpaIp9arxZyt
n9rifEZhdM7UpA9IYqDacirdVSWvtZ5qrxziUyPMuj7Ma4QGo51KGgVZx7aM9MQS
hUBS3CyXPVghBjtMb6FzDUaLLb4HaNLyaIn+ORw2g6EIaOIxcHKjP8iZZVg3rjT9
L3uvx3YY3ZztyPdVuDZcGEECgYEA2pX5u/Ec/1Qpip6fnTdh5sSraVDjPBGAHYas
pCbAqvhDc/Ho0FSNzndA+ixw+JxWtDFqmctMexhrzkVUuKuj8EZK6j6jNNKte6nh
gMlYaM3nzM7XltuC19CM1f9lQ8UDGRMbBvwpaEP+ZLoU13ck4mepl7R/J0hh1KcX
UEQVZckCgYEAoJE8lcKBpLKQ9QM8c735nCk8c2KXnHExjBx78eVrEQkwFcsPT68O
CSmdbVb8FllmtsxA8KRJpYcJglmVdjfFdvLtFyFFRK6Lirj9VPOi9M8l+hpSDT0g
9xeO7C6wHALyBH5mAcSYIAIajiQD+Sd7dk7yQ0MeFuneiaWIeyDsp20=
-----END RSA PRIVATE KEY-----`,
    {
      algorithm: 'RS256',
    }
  );
  const authAsInstallation = await fetch(
    `https://api.github.com/app/installations/${
      process.env.NODE_ENV === 'production'
        ? config.githubAppInstallationId
        : process.env.GITHUB_APP_INSTALLATION_ID
    }/access_tokens`,
    {
      headers: {
        Accept: 'application/vnd.github.machine-man-preview+json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    }
  );
  const data = await authAsInstallation.json();
  console.log(data);
  const responseRepos = await fetch(
    'https://api.github.com/installation/repositories',
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${data.token}`,
      },
    }
  );

  const fetchedRepos = await responseRepos.json();

  let repositories = [];
  let branches = [];

  const map = fetchedRepos.repositories.map(async (r) => {
    const responseBranches = await fetch(
      `https://api.github.com/repos/${user.username}/${r.name}/branches`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${data.token}`,
        },
      }
    );

    const fetchedBranches = await responseBranches.json();

    fetchedBranches.map((b) => {
      branches.push(b.name);
    });

    const repoToPush = {
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
      branches,
    };

    return repoToPush;
  });

  for await (let repoToPush of map) {
    repositories.push(repoToPush);
  }

  console.log('repos outside', repositories);

  return repositories;
};
