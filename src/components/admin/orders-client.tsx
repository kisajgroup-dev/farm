"use client";

import { useTransition } from "react";
import { updateOrderStatus, markInquiry } from "@/actions/orders";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TR, TD } from "@/components/ui/table";
type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

export function OrderRow({ order }: { order: { id: string; date: string; customer: string; items: string; status: string } }) {
  const [pending, start] = useTransition();
  return (
    <TR>
      <TD className="whitespace-nowrap text-sm text-muted-foreground">{order.date}</TD>
      <TD className="font-medium">{order.customer}</TD>
      <TD className="max-w-xs text-sm">{order.items}</TD>
      <TD>
        <Select
          value={order.status as OrderStatus}
          disabled={pending}
          onChange={(e) => start(() => updateOrderStatus(order.id, e.target.value as OrderStatus))}
          className="h-9 w-36"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </TD>
    </TR>
  );
}

export function InquiryRow({ inquiry }: { inquiry: { id: string; date: string; name: string; message: string; contact: string; handled: boolean } }) {
  const [pending, start] = useTransition();
  return (
    <TR>
      <TD className="whitespace-nowrap text-sm text-muted-foreground">{inquiry.date}</TD>
      <TD className="font-medium">{inquiry.name}</TD>
      <TD className="max-w-sm text-sm text-muted-foreground">{inquiry.message}</TD>
      <TD className="text-sm">{inquiry.contact}</TD>
      <TD className="text-right">
        {inquiry.handled ? (
          <Badge variant="success">Handled</Badge>
        ) : (
          <Button size="sm" variant="outline" disabled={pending} onClick={() => start(() => markInquiry(inquiry.id, true))}>
            Mark done
          </Button>
        )}
      </TD>
    </TR>
  );
}
