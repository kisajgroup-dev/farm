import Link from "next/link";
import { getDb } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, AlertTriangle, MessageSquare, Power } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const settings = await getSettings();
  const prisma = await getDb();
  const [products, lowStock, pendingOrders, inquiries] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { quantity: { lte: 5 } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.inquiry.count({ where: { handled: false } }),
  ]);

  const stats = [
    { label: "Products", value: products, Icon: Package, href: "/admin/products" },
    { label: "Low stock", value: lowStock, Icon: AlertTriangle, href: "/admin/inventory" },
    { label: "Pending orders", value: pendingOrders, Icon: ShoppingCart, href: "/admin/orders" },
    { label: "New inquiries", value: inquiries, Icon: MessageSquare, href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of your farm business.</p>
      </div>

      {/* Coming Soon status banner */}
      <Card className={settings.comingSoonMode ? "border-amber-300 bg-amber-50" : "border-green-300 bg-green-50"}>
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Power className={settings.comingSoonMode ? "h-6 w-6 text-amber-600" : "h-6 w-6 text-green-600"} />
            <div>
              <p className="font-medium">
                Website mode: {settings.comingSoonMode ? "Coming Soon" : "Live Shop"}
              </p>
              <p className="text-sm text-muted-foreground">
                {settings.comingSoonMode
                  ? "Visitors see only the Coming Soon page."
                  : "Your full shop is live to customers."}
              </p>
            </div>
          </div>
          <Link href="/admin/settings" className="text-sm font-medium text-primary hover:underline">Change →</Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-primary/70" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products"><Badge className="cursor-pointer px-4 py-2">+ Add product</Badge></Link>
        <Link href="/admin/blog"><Badge variant="secondary" className="cursor-pointer px-4 py-2">+ New update</Badge></Link>
        <Link href="/admin/settings"><Badge variant="outline" className="cursor-pointer px-4 py-2">Edit site settings</Badge></Link>
      </div>
    </div>
  );
}
