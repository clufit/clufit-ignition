import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/admin-auth.server";
import "@/styles/admin.css";

const NAV = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/journal", label: "Journal" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/messages", label: "Messages" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function logout() {
    await logoutAdmin();
    await router.navigate({ to: "/admin/login" });
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <span className="admin-logo">CLUFIT Admin</span>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/admin" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Button variant="clufitOutline" size="sm" onClick={logout}>Log out</Button>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
