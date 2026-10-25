import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getSession, updateSession, clearSession } from "@tanstack/react-start/server";
import { z } from "zod";

type AdminSessionData = { authed?: boolean };

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return { password, name: "clufit_admin", maxAge: 60 * 60 * 24 * 7 };
}

/** Throws if the caller doesn't hold an authenticated admin session. Call this at the top of every admin mutation/query server fn — route guards alone don't protect the RPC endpoint itself. */
export const requireAdminSession = createServerOnlyFn(async () => {
  const session = await getSession<AdminSessionData>(sessionConfig());
  if (!session.data.authed) throw new Error("Unauthorized");
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession<AdminSessionData>(sessionConfig());
  return { authed: Boolean(session.data.authed) };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ password: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || data.password !== expected) {
      throw new Error("Incorrect password.");
    }
    await updateSession<AdminSessionData>(sessionConfig(), { authed: true });
    return { ok: true } as const;
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  await clearSession(sessionConfig());
  return { ok: true } as const;
});
