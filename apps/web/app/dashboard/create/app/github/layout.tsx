import { GithubProvider } from "@/contexts/GithubContext";
import { serverClientWithAuth } from "@/lib/apollo.server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await serverClientWithAuth();

  const apps = await client.apps({
    limit: 1_000_000,
  });

  const installation = await client.githubInstallationId();
  const repos = await client
    .repositories({
      installationId: installation.githubInstallationId.id,
    })
    .then((res) => res.repositories)
    .catch(() => []);

  return (
    <GithubProvider
      apps={apps.apps.items}
      installationId={installation.githubInstallationId.id}
      repositories={repos}
    >
      {children}
    </GithubProvider>
  );
}
