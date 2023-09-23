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
  console.log("Apps");

  const installation = await client.githubInstallationId();
  console.log("Installation");
  const repos = await client
    .repositories({
      installationId: installation.githubInstallationId.id,
    })
    .catch(() => null);
  console.log("Repos");

  return (
    <GithubProvider
      apps={apps.apps.items}
      installationId={installation.githubInstallationId.id}
      repositories={repos?.repositories ?? null}
    >
      {children}
    </GithubProvider>
  );
}
