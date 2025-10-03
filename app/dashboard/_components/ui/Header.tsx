'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import clsx from "clsx";
import { ChartNetwork, ChartNoAxesCombined, Newspaper, Umbrella, Menu, X, PanelLeftIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ----------------------- config des liens (même que la sidebar) ----------------------- */
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

/* ----------------------- Header ----------------------- */
export default function Header({toggleSidebar}:{toggleSidebar:any}) {
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;

  const [openMobile, setOpenMobile] = React.useState(false);
  const [openUserMenu, setOpenUserMenu] = React.useState(false);

  // close menus when route changes
  React.useEffect(() => {
    setOpenMobile(false);
    setOpenUserMenu(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 rounded-xl ">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* left : logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/landing/logo-horizontal.png"
                alt="Logo POSA"
                width={70}
                height={24}
                className="rounded-xl"
              />
              <span className="sr-only">Accueil</span>
            </Link>
          </div>

          {/* middle / nav (desktop) */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.title} className="list-none">
                    <Link href={item.href}>
                      <span
                        className={clsx(
                          "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                          active
                            ? "bg-zinc-100 dark:bg-zinc-900 font-medium text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900/60"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* right : user + controls */}
          <div className="flex items-center gap-3">
            {/* desktop user card */}
            <div className="hidden md:flex md:items-center md:gap-3">
              <div className="relative">
                <button
                  onClick={() => setOpenUserMenu((s) => !s)}
                  className="flex items-center gap-2 rounded-xl px-4 border border-zinc-200 p-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                  aria-haspopup="true"
                  aria-expanded={openUserMenu}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.image || ""} alt={user?.name || user?.email || "User"} />
                    <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
                  </Avatar>

                  <div className="hidden lg:flex min-w-0 flex-col items-start">
                    <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {user?.name || user?.email || "Invité"}
                    </div>
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user?.email ? user.email : "Non connecté"}
                    </div>
                  </div>
                </button>

                {/* dropdown */}
                {openUserMenu && (
                  <div
                    className="absolute right-0 z-20 mt-2 w-56 divide-y divide-zinc-100 rounded-md border border-zinc-100 bg-white shadow-lg dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950"
                    role="menu"
                  >
                    <div className="p-2">
                      <Link href="/profile">
                        <span className="block rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900/60" role="menuitem">
                          Mon profil
                        </span>
                      </Link>
                      <Link href="/settings">
                        <span className="block rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900/60" role="menuitem">
                          Paramètres
                        </span>
                      </Link>
                    </div>

                    <div className="p-2">
                      {user?.email ? (
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                          role="menuitem"
                        >
                          Déconnexion
                        </button>
                      ) : (
                        <Link href="/login">
                          <span className="block rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900/60" role="menuitem">
                            Se connecter
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button
                    data-sidebar="trigger"
                    data-slot="sidebar-trigger"
                    variant="ghost"
                    size="icon"
                    className={cn("size-7")}
                    onClick={() => {
                      toggleSidebar()
                    }}
                  >
                    <PanelLeftIcon />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
            </div>

            {/* mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setOpenMobile((s) => !s)}
                aria-label="Toggle menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-100/90 dark:bg-zinc-900/60"
              >
                {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* mobile nav panel */}
        {openMobile && (
          <div className="mt-2 md:hidden">
            <nav aria-label="Mobile" className="space-y-1 px-2 pb-4">
              {NAV_ITEMS.map((item) => {
                const active = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href}>
                    <span
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                        active
                          ? "bg-zinc-100 font-medium text-zinc-900"
                          : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </span>
                  </Link>
                );
              })}

              <div className="mt-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <div className="flex items-center gap-3 px-1">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.image || ""} alt={user?.name || user?.email || "User"} />
                    <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{user?.name || user?.email || "Invité"}</div>
                    <div className="truncate text-xs text-zinc-500">{user?.email ? user.email : "Non connecté"}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-1 px-1">
                   {/* pas encore implémenté
                  <Link href="/profile">
                    <span className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Mon profil</span>
                  </Link>
                   
                   */}
                  {user?.email ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  ) : (
                    <Link href="/login">
                      <span className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Se connecter</span>
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
