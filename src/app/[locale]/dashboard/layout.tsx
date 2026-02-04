import { Sidebar, Header, SidebarProvider } from "@/components/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 md:ml-64 transition-all duration-300">
          <Header />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
