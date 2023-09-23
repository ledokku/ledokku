import { serverClient, serverClientWithAuth } from "@/lib/apollo.server";
import { DatabaseInfoPage } from "./components/DatabasePage";

export default async function DatabasePage() {
  const client = await serverClientWithAuth();
  const apps = await client.apps({
    limit: 1_000_000,
  });

  return <DatabaseInfoPage apps={apps.apps.items} />;
}
