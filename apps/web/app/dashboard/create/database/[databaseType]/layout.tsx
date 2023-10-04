import { DatabaseListProvider } from "@/contexts/DatabaseListContext";
import { serverClientWithAuth } from "@/lib/apollo.server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await serverClientWithAuth();
  const databases = await client.database({
    limit: 1_000_000,
  });

  return (
    <DatabaseListProvider databases={databases.databases.items}>
      {children}
    </DatabaseListProvider>
  );
}
