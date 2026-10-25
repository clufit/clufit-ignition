import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createResource,
  deleteResource,
  listResourcesAdmin,
  updateResource,
  type Resource,
} from "@/lib/resources.server";
import "@/styles/admin.css";

export const Route = createFileRoute("/admin/resources")({ component: AdminResources });

type FormValues = {
  section: "program" | "guide";
  title: string;
  description: string;
  image: string;
  fileUrl: string;
  sortOrder: number;
};

const BLANK: FormValues = { section: "program", title: "", description: "", image: "", fileUrl: "", sortOrder: 0 };

function AdminResources() {
  const queryClient = useQueryClient();
  const resourcesQuery = useQuery({ queryKey: ["admin-resources"], queryFn: () => listResourcesAdmin() });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<FormValues>(BLANK);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditingId(null);
    setValues(BLANK);
    setError(null);
    setOpen(true);
  }

  function openEdit(resource: Resource) {
    setEditingId(resource.id);
    setValues({
      section: resource.section as "program" | "guide",
      title: resource.title,
      description: resource.description,
      image: resource.image ?? "",
      fileUrl: resource.fileUrl ?? "",
      sortOrder: resource.sortOrder,
    });
    setError(null);
    setOpen(true);
  }

  async function submit() {
    setPending(true);
    setError(null);
    try {
      if (editingId !== null) {
        await updateResource({ data: { id: editingId, values } });
      } else {
        await createResource({ data: values });
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this resource.");
    } finally {
      setPending(false);
    }
  }

  async function remove(resource: Resource) {
    if (!window.confirm(`Delete "${resource.title}"? This can't be undone.`)) return;
    await deleteResource({ data: { id: resource.id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
  }

  return (
    <div>
      <div className="admin-section-head">
        <h1>Resources</h1>
        <Button variant="clufit" onClick={openCreate}>Add resource</Button>
      </div>

      {resourcesQuery.isLoading && <p className="admin-empty">Loading…</p>}
      {resourcesQuery.data?.length === 0 && <p className="admin-empty">No resources yet.</p>}
      {!!resourcesQuery.data?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Order</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {resourcesQuery.data.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.section}</TableCell>
                <TableCell>{r.sortOrder}</TableCell>
                <TableCell>
                  <div className="admin-row-actions">
                    <Button variant="clufitOutline" size="sm" onClick={() => openEdit(r)}>Edit</Button>
                    <Button variant="clufitOutline" size="sm" onClick={() => remove(r)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Edit resource" : "Add resource"}</DialogTitle>
          </DialogHeader>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <label>
                Section
                <Select value={values.section} onValueChange={(section) => setValues((v) => ({ ...v, section: section as "program" | "guide" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label>
                Sort order
                <Input type="number" value={values.sortOrder} onChange={(e) => setValues((v) => ({ ...v, sortOrder: Number(e.target.value) }))} />
              </label>
            </div>
            <label>
              Title
              <Input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} />
            </label>
            <label>
              Description
              <Textarea rows={2} placeholder="e.g. 4 weeks · 3 days/week, or PDF · 12 pages" value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />
            </label>
            <div className="admin-form-row">
              <label>
                Image URL
                <Input value={values.image} onChange={(e) => setValues((v) => ({ ...v, image: e.target.value }))} />
              </label>
              <label>
                File / link URL
                <Input value={values.fileUrl} onChange={(e) => setValues((v) => ({ ...v, fileUrl: e.target.value }))} />
              </label>
            </div>
            {error && <p className="admin-error" role="alert">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="clufit" onClick={submit} disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
