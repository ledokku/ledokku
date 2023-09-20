import { PageProps } from "@/types/next";
import { AppSettingsPage } from "./components/AppSettingsPage";
import { serverClientWithAuth } from "@/lib/apollo.server";

export default async function Settings({ params }: PageProps) {
  const client = await serverClientWithAuth();
  const app = await client.appById({
    appId: params?.appId as string,
  });

  return <AppSettingsPage app={app.app} />;
}
