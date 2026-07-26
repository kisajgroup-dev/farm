import { getDb } from "@/lib/prisma";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderRow, InquiryRow } from "@/components/admin/orders-client";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const prisma = await getDb();
  const [orders, inquiries] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true }, take: 50 }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Orders & Inquiries</h1>
        <p className="mt-1 text-muted-foreground">Orders come in through WhatsApp; inquiries via the contact form.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead><TR><TH>Date</TH><TH>Customer</TH><TH>Items</TH><TH>Status</TH></TR></THead>
            <TBody>
              {orders.length === 0 && <TR><TD colSpan={4} className="py-8 text-center text-muted-foreground">No orders logged yet.</TD></TR>}
              {orders.map((o) => (
                <OrderRow key={o.id} order={{
                  id: o.id,
                  date: format(new Date(o.createdAt), "PP"),
                  customer: o.customerName ?? "—",
                  items: o.items.map((i) => `${i.name} ×${i.quantity}`).join(", "),
                  status: o.status,
                }} />
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Customer Inquiries</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead><TR><TH>Date</TH><TH>Name</TH><TH>Message</TH><TH>Contact</TH><TH></TH></TR></THead>
            <TBody>
              {inquiries.length === 0 && <TR><TD colSpan={5} className="py-8 text-center text-muted-foreground">No inquiries yet.</TD></TR>}
              {inquiries.map((q) => (
                <InquiryRow key={q.id} inquiry={{
                  id: q.id,
                  date: format(new Date(q.createdAt), "PP"),
                  name: q.name, message: q.message,
                  contact: q.phone || q.email || "—",
                  handled: q.handled,
                }} />
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
