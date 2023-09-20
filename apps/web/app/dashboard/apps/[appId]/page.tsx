import { serverClientWithAuth } from "@/lib/apollo.server";
import { PageProps } from "@/types/next";
import AppInfoPage from "./components";

export default async function AppInfo(props?: PageProps) {
  const client = await serverClientWithAuth();
  const app = await client.appById({
    appId: props?.params?.appId as string,
  });
  const database = await client.database({
    limit: 1_000_000,
  });

  return <AppInfoPage app={app.app} databases={database.databases.items} />;
}
