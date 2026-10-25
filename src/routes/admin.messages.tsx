import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteMessage, listMessages, markMessageRead, type ContactMessage } from "@/lib/contact.server";
import "@/styles/admin.css";

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

function AdminMessages() {
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({ queryKey: ["admin-messages"], queryFn: () => listMessages() });

  async function toggleRead(message: ContactMessage) {
    await markMessageRead({ data: { id: message.id, read: !message.read } });
    await queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
  }

  async function remove(message: ContactMessage) {
    if (!window.confirm(`Delete the message from "${message.name}"?`)) return;
    await deleteMessage({ data: { id: message.id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
  }

  return (
    <div>
      <div className="admin-section-head"><h1>Messages</h1></div>
      {messagesQuery.isLoading && <p className="admin-empty">Loading…</p>}
      {messagesQuery.data?.length === 0 && <p className="admin-empty">No messages yet.</p>}
      {messagesQuery.data?.map((m) => (
        <div key={m.id} className="admin-dashboard-panel">
          <div className="admin-section-head" style={{ marginBottom: 8 }}>
            <div>
              <strong>{m.name}</strong> — {m.email} {!m.read && <Badge>Unread</Badge>}
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                {m.reason} · {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="admin-row-actions">
              <Button variant="clufitOutline" size="sm" onClick={() => toggleRead(m)}>{m.read ? "Mark unread" : "Mark read"}</Button>
              <Button variant="clufitOutline" size="sm" onClick={() => remove(m)}>Delete</Button>
            </div>
          </div>
          <p>{m.message}</p>
        </div>
      ))}
    </div>
  );
}
