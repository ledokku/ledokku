import { serverClientWithAuth } from "@/lib/apollo.server";
import AppInfoPage from "./components";

export default async function AppInfo() {
  const client = await serverClientWithAuth();
  const database = await client.database({
    limit: 1_000_000,
  });

  return <AppInfoPage databases={database.databases.items} />;
}
