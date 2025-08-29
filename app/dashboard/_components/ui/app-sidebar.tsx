'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartNetwork, ChartNoAxesCombined, Newspaper, Umbrella, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import * as React from "react";
import clsx from "clsx";
import Image from "next/image";

/* ----------------------- config des liens ----------------------- */
type Item = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: Item[] = [
  { title: "Marché crypto",      href: "/dashboard/market",    icon: ChartNoAxesCombined },
  { title: "Simulation",         href: "/dashboard/simulation", icon: ChartNetwork },
  { title: "Analyse des risques", href: "/dashboard/risk",       icon: Umbrella },
  { title: "Assistant",          href: "/dashboard/assist",     icon: Newspaper },
];

/* ----------------------- helpers ----------------------- */
function getInitials(name?: string | null, email?: string | null) {
  const base = name || email || "";
  const parts = base.replace(/@.*/, "").split(/[.\s_-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.slice(0, 2) || "U").toUpperCase();
}

/* ----------------------- sidebar ----------------------- */
export function AppSidebar() {
  const pathname = usePathname();
  const { data, status } = useSession();
  console.log("session", status, data);
  const user = data?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-white dark:bg-zinc-950">
      {/* ---------- header / logo ---------- */}
      <SidebarHeader className="h-20">
        <Link href="/" className="flex h-full items-center gap-3 px-2">
          <Image src="/landing/logo-horizontal.png" width={128} height={64} alt="Logo horizontale POSA" className="rounded-xl"></Image>
        </Link>
      </SidebarHeader>

      {/* ---------- contenu / nav ---------- */}
      <SidebarContent>
        <nav className="px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title} className="list-none">
                <Link href={item.href}>
                  <SidebarMenuButton
                    className={clsx(
                      "h-11 gap-3",
                      active
                        ? "bg-zinc-100 dark:bg-zinc-900 font-medium"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </nav>

        {/* ---------- footer / user card ---------- */}
        <div className="mt-auto px-2 py-3">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2">
            <Avatar className="h-9 w-9">
              {/* image Gmail/NextAuth si dispo */}
              <AvatarImage src={user?.image || ""} alt={user?.name || user?.email || "User"} />
              <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {user?.name || user?.email || "Invité"}
              </div>
              <div className="truncate text-xs text-zinc-500">
                {user?.email ? user.email : "Non connecté"}
              </div>
            </div>
            {user?.email ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-lg border px-2.5 py-1 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900"
                title="Se déconnecter"
              >
                Quitter
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-black px-2.5 py-1 text-xs text-white dark:bg-white dark:text-black"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
