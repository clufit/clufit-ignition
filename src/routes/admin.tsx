import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/clufit/AdminShell";
import { getAdminSession } from "@/lib/admin-auth.server";
import { getDashboardSummary } from "@/lib/dashboard.server";
import { getTrafficSummary } from "@/lib/analytics.server";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { authed } = await getAdminSession();
    if (!authed) throw redirect({ to: "/admin/login" });
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/admin/login") return <Outlet />;
  if (path !== "/admin") return <AdminShell><Outlet /></AdminShell>;
  return <AdminShell><Dashboard /></AdminShell>;
}

function Dashboard() {
  const summary = useQuery({ queryKey: ["admin-summary"], queryFn: () => getDashboardSummary() });
  const traffic = useQuery({ queryKey: ["admin-traffic"], queryFn: () => getTrafficSummary() });

  return (
    <div>
      <div className="admin-section-head"><h1>Dashboard</h1></div>
      <div className="admin-stat-grid">
        <StatCard label="Newsletter subscribers" value={summary.data?.subscribers} loading={summary.isLoading} />
        <StatCard label="Unread messages" value={summary.data?.unreadMessages} loading={summary.isLoading} />
        <StatCard label="Journal articles" value={summary.data?.articles} loading={summary.isLoading} />
        <StatCard label="Resources" value={summary.data?.resources} loading={summary.isLoading} />
        <StatCard label="Pageviews (28d)" value={traffic.data?.configured ? traffic.data.pageViews : undefined} loading={traffic.isLoading} />
        <StatCard label="Visitors (28d)" value={traffic.data?.configured ? traffic.data.totalUsers : undefined} loading={traffic.isLoading} />
      </div>

      {traffic.data && !traffic.data.configured && (
        <p className="admin-empty">Google Analytics isn't configured yet — add GA_PROPERTY_ID, GA_CLIENT_EMAIL and GA_PRIVATE_KEY to see traffic here.</p>
      )}

      {traffic.data?.configured && traffic.data.daily.length > 0 && (
        <div className="admin-dashboard-panel">
          <h2>Pageviews, last 28 days</h2>
          <table className="admin-trend-table">
            <tbody>
              {traffic.data.daily.map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.pageViews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number | undefined; loading: boolean }) {
  return (
    <div className="admin-stat-card">
      <span>{label}</span>
      <strong>{loading ? "…" : value ?? "—"}</strong>
    </div>
  );
}
