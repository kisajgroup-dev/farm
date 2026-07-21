"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Settings, Package, Boxes, ShoppingCart,
  Newspaper, LogOut, Sprout, Menu, X, ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/settings", label: "Website Settings", Icon: Settings },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/inventory", label: "Inventory", Icon: Boxes },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/blog", label: "Blog / Updates", Icon: Newspaper },
];

export function AdminShell({ children, name }: { children: React.ReactNode; name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2 font-display font-semibold"><Sprout className="h-5 w-5 text-primary" /> Admin</span>
        <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>

      <div className="lg:flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-full border-r border-border bg-background lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64",
          open ? "block" : "hidden lg:block"
        )}>
          <div className="hidden items-center gap-2 px-6 py-5 font-display text-lg font-semibold lg:flex">
            <Sprout className="h-6 w-6 text-primary" /> Farm Admin
          </div>
          <nav className="space-y-1 px-3 py-2">
            {NAV.map(({ href, label, Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 space-y-1 border-t border-border px-3 py-3">
            <a href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
              <ExternalLink className="h-4 w-4" /> View website
            </a>
            <form action={logoutAction}>
              <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
          <p className="px-6 py-2 text-xs text-muted-foreground">Signed in as {name}</p>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
