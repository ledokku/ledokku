import { Footer } from "@/ui/components/nav/Footer";
import { Header } from "@/ui/components/nav/Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="py-8 grow">
        <div className="container mx-auto px-4 lg:px-0 h-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
