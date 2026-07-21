"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/actions/products";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { UNIT_LABEL } from "@/lib/utils";

interface P { id: string; name: string; unit: string; quantity: number; available: boolean }

function Row({ p }: { p: P }) {
  const [qty, setQty] = useState(p.quantity);
  const [available, setAvailable] = useState(p.available);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      await updateStock(p.id, qty, available);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  const low = qty <= 5;
  return (
    <TR>
      <TD className="font-medium">{p.name}</TD>
      <TD>
        <div className="flex items-center gap-2">
          <Input type="number" step="0.1" value={qty} onChange={(e) => setQty(parseFloat(e.target.value) || 0)} className="h-9 w-24" />
          <span className="text-sm text-muted-foreground">{UNIT_LABEL[p.unit]}</span>
          {low && <Badge variant="warning">Low</Badge>}
        </div>
      </TD>
      <TD><Switch checked={available} onCheckedChange={setAvailable} /></TD>
      <TD className="text-right">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "..." : saved ? "✔ Saved" : "Save"}</Button>
      </TD>
    </TR>
  );
}

export function InventoryManager({ products }: { products: P[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <THead><TR><TH>Product</TH><TH>Stock</TH><TH>Available</TH><TH></TH></TR></THead>
          <TBody>
            {products.length === 0 && <TR><TD colSpan={4} className="py-8 text-center text-muted-foreground">No products yet.</TD></TR>}
            {products.map((p) => <Row key={p.id} p={p} />)}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
