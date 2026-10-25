import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/clufit-data";
import {
  createArticle,
  deleteArticle,
  listAllArticlesAdmin,
  updateArticle,
  type JournalArticle,
} from "@/lib/journal.server";
import "@/styles/admin.css";

export const Route = createFileRoute("/admin/journal")({ component: AdminJournal });

const ARTICLE_CATEGORIES = categories.filter((c) => c !== "All");

type FormValues = {
  slug: string;
  title: string;
  deck: string;
  body: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  published: boolean;
};

const BLANK: FormValues = { slug: "", title: "", deck: "", body: "", category: ARTICLE_CATEGORIES[0] ?? "", image: "", author: "", readTime: "", published: false };

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function AdminJournal() {
  const queryClient = useQueryClient();
  const articlesQuery = useQuery({ queryKey: ["admin-articles"], queryFn: () => listAllArticlesAdmin() });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [values, setValues] = useState<FormValues>(BLANK);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditingId(null);
    setSlugTouched(false);
    setValues(BLANK);
    setError(null);
    setOpen(true);
  }

  function openEdit(article: JournalArticle) {
    setEditingId(article.id);
    setSlugTouched(true);
    setValues({
      slug: article.slug,
      title: article.title,
      deck: article.deck,
      body: article.body,
      category: article.category,
      image: article.image,
      author: article.author,
      readTime: article.readTime,
      published: Boolean(article.publishedAt),
    });
    setError(null);
    setOpen(true);
  }

  async function submit() {
    setPending(true);
    setError(null);
    try {
      if (editingId !== null) {
        await updateArticle({ data: { id: editingId, values } });
      } else {
        await createArticle({ data: values });
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this article.");
    } finally {
      setPending(false);
    }
  }

  async function remove(article: JournalArticle) {
    if (!window.confirm(`Delete "${article.title}"? This can't be undone.`)) return;
    await deleteArticle({ data: { id: article.id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
  }

  return (
    <div>
      <div className="admin-section-head">
        <h1>Journal</h1>
        <Button variant="clufit" onClick={openCreate}>Add article</Button>
      </div>

      {articlesQuery.isLoading && <p className="admin-empty">Loading…</p>}
      {articlesQuery.data?.length === 0 && <p className="admin-empty">No articles yet.</p>}
      {!!articlesQuery.data?.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {articlesQuery.data.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell>
                  <Badge variant={a.publishedAt ? "default" : "secondary"}>{a.publishedAt ? "Published" : "Draft"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="admin-row-actions">
                    <Button variant="clufitOutline" size="sm" onClick={() => openEdit(a)}>Edit</Button>
                    <Button variant="clufitOutline" size="sm" onClick={() => remove(a)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Edit article" : "Add article"}</DialogTitle>
          </DialogHeader>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <label>
                Title
                <Input
                  value={values.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : slugify(title) }));
                  }}
                />
              </label>
              <label>
                Slug
                <Input
                  value={values.slug}
                  onChange={(e) => { setSlugTouched(true); setValues((v) => ({ ...v, slug: e.target.value })); }}
                />
              </label>
            </div>
            <label>
              Deck (short teaser)
              <Textarea rows={2} value={values.deck} onChange={(e) => setValues((v) => ({ ...v, deck: e.target.value }))} />
            </label>
            <label>
              Body
              <Textarea rows={8} value={values.body} onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))} />
            </label>
            <div className="admin-form-row">
              <label>
                Category
                <Select value={values.category} onValueChange={(category) => setValues((v) => ({ ...v, category }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ARTICLE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label>
                Read time
                <Input placeholder="6 min" value={values.readTime} onChange={(e) => setValues((v) => ({ ...v, readTime: e.target.value }))} />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Image URL
                <Input value={values.image} onChange={(e) => setValues((v) => ({ ...v, image: e.target.value }))} />
              </label>
              <label>
                Author
                <Input value={values.author} onChange={(e) => setValues((v) => ({ ...v, author: e.target.value }))} />
              </label>
            </div>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Checkbox checked={values.published} onCheckedChange={(c) => setValues((v) => ({ ...v, published: c === true }))} />
              Published
            </label>
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
