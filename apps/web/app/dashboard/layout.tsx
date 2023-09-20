import { Footer } from "@/ui/components/Footer";
import { Header } from "@/ui/components/Header";

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
