import { serverClientWithAuth } from "@/lib/apollo.server";
import { PageProps } from "@/types/next";
import { AppHeaderInfo } from "@/ui/modules/app/AppHeaderInfo";
import { AppHeaderTabNav } from "@/ui/modules/app/AppHeaderTabNav";

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
  const domains = await client.domains({
    appId: params?.appId as string,
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8 mb-8">
        <AppHeaderInfo
          app={app.app}
          domains={domains.domains.map((it) => it.domain)}
        />
        <AppHeaderTabNav app={app.app} />
      </div>
      <div>{children}</div>
    </div>
  );
}
