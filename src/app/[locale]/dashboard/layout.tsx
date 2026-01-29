import { Sidebar, Header } from '@/components/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
