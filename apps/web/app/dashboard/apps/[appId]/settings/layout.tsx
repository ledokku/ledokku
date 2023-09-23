import { PageProps } from "@/types/next";
import { AppSettingsMenu } from "@/ui/components/nav/AppSettingsMenu";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
} & PageProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div>
        <AppSettingsMenu />
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
