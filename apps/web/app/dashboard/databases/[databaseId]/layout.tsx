import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { serverClientWithAuth } from "@/lib/apollo.server";
import { PageProps } from "@/types/next";
import { DatabaseHeaderInfo } from "@/ui/components/misc/DatabaseHeaderInfo";
import { DatabaseHeaderTabNav } from "@/ui/components/nav/DatabaseHeaderTabNav";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & PageProps) {
  const client = await serverClientWithAuth();
  const database = await client.databaseById({
    databaseId: params?.databaseId as string,
  });
  const info = await client.databaseInfo({
    databaseId: params?.databaseId as string,
  });

  return (
    <DatabaseProvider database={database.database} info={info.databaseInfo}>
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 mb-8">
          <DatabaseHeaderInfo />
          <DatabaseHeaderTabNav />
        </div>
        <div>{children}</div>
      </div>
    </DatabaseProvider>
  );
}
