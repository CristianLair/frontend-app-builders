import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SessionGuard } from "@/components/session/session-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <div className="flex min-h-full flex-col">
        <DashboardNav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      </div>
    </SessionGuard>
  );
}