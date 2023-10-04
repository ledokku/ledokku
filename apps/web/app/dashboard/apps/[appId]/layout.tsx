import { AppProvider } from "@/contexts/AppContext";
import { serverClientWithAuth } from "@/lib/apollo.server";
import { PageProps } from "@/types/next";
import { AppHeaderInfo } from "@/ui/components/misc/AppHeaderInfo";
import { AppHeaderTabNav } from "@/ui/components/nav/AppHeaderTabNav";

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
    <AppProvider app={app.app}>
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 mb-8">
          <AppHeaderInfo domains={domains.domains.map((it) => it.domain)} />
          <AppHeaderTabNav />
        </div>
        <div>{children}</div>
      </div>
    </AppProvider>
  );
}
