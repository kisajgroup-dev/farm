"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { saveBlogPost, deleteBlogPost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Post { id: string; title: string; excerpt: string | null; content: string; coverUrl: string | null; published: boolean }

export function BlogManager({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(saveBlogPost, { ok: false, error: null as string | null });
  const [, startDelete] = useTransition();

  useEffect(() => { if (state.ok) { setShowForm(false); setEditing(null); } }, [state.ok]);

  return (
    <div className="space-y-4">
      {!showForm && <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" /> New post</Button>}

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">{editing ? "Edit post" : "New post"}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-5 w-5" /></button>
            </div>
            <form action={action} className="space-y-4">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editing?.title} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="coverUrl">Cover image URL</Label>
                <Input id="coverUrl" name="coverUrl" defaultValue={editing?.coverUrl ?? ""} placeholder="https://..." className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input id="excerpt" name="excerpt" defaultValue={editing?.excerpt ?? ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" defaultValue={editing?.content} rows={8} required className="mt-1.5" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={editing ? editing.published : true} className="h-4 w-4" /> Published
              </label>
              {state.error && <p className="text-sm text-destructive">{state.error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save post"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
        {posts.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{p.title}</p>
                  {p.published ? <Badge variant="success">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                </div>
                {p.excerpt && <p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this post?")) startDelete(() => deleteBlogPost(p.id)); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
