import { LayoutProps } from "../layout";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

export default function HomeLayout({ children }: Readonly<LayoutProps>) {
  return (
    <>
      <Header />
      <main className="flex flex-col w-full max-w-[1120px] mx-auto my-4 p-4 gap-8">
        {children}
        <Toaster richColors />
      </main>
    </>
  );
}
