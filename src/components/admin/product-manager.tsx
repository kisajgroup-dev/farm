"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Tag } from "lucide-react";
import { saveProduct, deleteProduct, createCategory, deleteCategory } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatLKR, UNIT_LABEL } from "@/lib/utils";

interface P {
  id: string; name: string; description: string | null; imageUrl: string | null;
  price: number; unit: string; quantity: number; available: boolean; featured: boolean;
  categoryId: string | null; categoryName: string | null;
}
interface Cat { id: string; name: string; description?: string | null }
const UNITS = ["KG", "PACK", "BUNCH", "PIECE", "GRAM", "LITRE"];

export function ProductManager({ products, categories }: { products: P[]; categories: Cat[] }) {
  const [editing, setEditing] = useState<P | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const [state, action, pending] = useActionState(saveProduct, { ok: false, error: null as string | null });
  const [catState, catAction, catPending] = useActionState(createCategory, { ok: false, error: null as string | null });
  const [, startDelete] = useTransition();

  useEffect(() => { if (state.ok) { setShowForm(false); setEditing(null); } }, [state.ok]);
  useEffect(() => { if (catState.ok) { setShowCatModal(false); } }, [catState.ok]);

  function openNew() { setEditing(null); setShowForm(true); }
  function openEdit(p: P) { setEditing(p); setShowForm(true); }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {!showForm && (
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add product</Button>
        )}
        <Button variant="outline" onClick={() => setShowCatModal(true)}>
          <Tag className="h-4 w-4 mr-1" /> Manage Categories ({categories.length})
        </Button>
      </div>

      {/* Category Management Modal/Card */}
      {showCatModal && (
        <Card className="border-primary/30 bg-card">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Manage Product Categories</h3>
                <p className="text-xs text-muted-foreground">Add or delete categories for your products</p>
              </div>
              <button onClick={() => setShowCatModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={catAction} className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input name="name" placeholder="Category name (e.g., Vegetables, Fruits)" required />
              </div>
              <div className="flex-1">
                <Input name="description" placeholder="Description (optional)" />
              </div>
              <Button type="submit" disabled={catPending}>
                {catPending ? "Adding..." : "Add Category"}
              </Button>
            </form>
            {catState.error && <p className="mb-4 text-xs text-destructive">{catState.error}</p>}

            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories defined yet.</p>
              )}
              {categories.map((c) => (
                <Badge key={c.id} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete category "${c.name}"?`)) {
                        startDelete(async () => { await deleteCategory(c.id); });
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Add/Edit Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">{editing ? "Edit product" : "New product"}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-5 w-5" /></button>
            </div>
            <form action={action} className="space-y-4">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={editing?.name} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" defaultValue={editing?.imageUrl ?? ""} placeholder="https://..." className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} className="mt-1.5" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editing?.price} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select id="unit" name="unit" defaultValue={editing?.unit ?? "KG"} className="mt-1.5">
                    {UNITS.map((u) => <option key={u} value={u}>{UNIT_LABEL[u]}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Stock quantity</Label>
                  <Input id="quantity" name="quantity" type="number" step="0.1" defaultValue={editing?.quantity ?? 0} required className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select id="categoryId" name="categoryId" defaultValue={editing?.categoryId ?? ""} className="mt-1.5">
                  <option value="">— None —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="available" defaultChecked={editing ? editing.available : true} className="h-4 w-4" /> Available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" defaultChecked={editing?.featured} className="h-4 w-4" /> Featured
                </label>
              </div>
              {state.error && <p className="text-sm text-destructive">{state.error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save product"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Product</TH><TH>Price</TH><TH>Stock</TH><TH>Status</TH><TH></TH>
              </TR>
            </THead>
            <TBody>
              {products.length === 0 && (
                <TR><TD className="py-8 text-center text-muted-foreground" colSpan={5}>No products yet. Add your first!</TD></TR>
              )}
              {products.map((p) => (
                <TR key={p.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                          <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.categoryName ?? "—"}</p>
                      </div>
                    </div>
                  </TD>
                  <TD>{formatLKR(p.price)} <span className="text-muted-foreground">/ {UNIT_LABEL[p.unit]}</span></TD>
                  <TD>{p.quantity} {UNIT_LABEL[p.unit]}</TD>
                  <TD>
                    {p.available && p.quantity > 0
                      ? <Badge variant="success">Available</Badge>
                      : <Badge variant="destructive">Unavailable</Badge>}
                    {p.featured && <Badge variant="warning" className="ml-1">Featured</Badge>}
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm(`Delete "${p.name}"?`)) startDelete(() => deleteProduct(p.id));
                      }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
