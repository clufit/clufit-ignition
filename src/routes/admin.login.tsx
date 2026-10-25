import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminSession, loginAdmin } from "@/lib/admin-auth.server";
import "@/styles/admin.css";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { authed } = await getAdminSession();
    if (authed) throw redirect({ to: "/admin" });
  },
  head: () => ({ meta: [{ title: "Admin login — CLUFIT" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await loginAdmin({ data: { password } });
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="admin-login-form">
        <h1>CLUFIT Admin</h1>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
        {error && <p className="admin-error" role="alert">{error}</p>}
        <Button type="submit" variant="clufit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      </form>
    </div>
  );
}
