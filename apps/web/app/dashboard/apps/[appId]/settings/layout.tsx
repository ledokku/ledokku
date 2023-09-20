import { serverClientWithAuth } from "@/lib/apollo.server";
import { PageProps } from "@/types/next";
import { AppSettingsMenu } from "@/ui/modules/app/AppSettingsMenu";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & PageProps) {
  const client = await serverClientWithAuth();
  const app = await client.appById({
    appId: params?.appId as string,
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div>
        <AppSettingsMenu app={app.app} />
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
