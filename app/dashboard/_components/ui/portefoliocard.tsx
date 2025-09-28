// app/dashboard/_components/portfolio-card.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useDeletePortfolio, useSimulatePortfolio } from "@/app/dashboard/_lib/hooks/simulation";
import CountUp from "react-countup"


type Holding = {
  id: number;
  crypto_detail?: { image_url?: string; symbol?: string; name?: string };
};
export type Portfolio = {
  id: number;
  name: string;
  creation_date: string;
  holding_start: string;
  holding_end: string;
  initial_budget: number;
  allocation_type: string;
  holdings: Holding[];
};
/*
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
*/
export default function PortfolioCard({
  portfolio,
  onDeleted,
}: {
  portfolio: Portfolio;
  onDeleted?: () => void;
}) {
  const simulate = useSimulatePortfolio();
  const del = useDeletePortfolio();

  const top = (portfolio.holdings || []).slice(0, 6);
  const extra = Math.max(0, (portfolio.holdings?.length || 0) - top.length);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 md:p-5 shadow-sm hover:shadow-md transition">
      {/* HEADER : titre + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/dashboard/simulation/${portfolio.id}`}
            className="text-base md:text-lg font-semibold text-violet-600 dark:text-violet-400 hover:underline line-clamp-1"
            title={portfolio.name}
          >
            {portfolio.name}
          </Link>
          <p className="mt-0.5 text-xs text-zinc-500">
            Créé {formatDistanceToNow(new Date(portfolio.creation_date), { addSuffix: true, locale: fr })}
          </p>
        </div>
        <Badge variant="outline" className="uppercase text-[10px] px-2 py-1 rounded-full">
          {portfolio.allocation_type}
        </Badge>
      </div>

      {/* BODY en 2 colonnes (desktop) : infos à gauche / actions à droite */}
      <div className="mt-3 md:mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        {/* Colonne gauche */}
        <div>
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <CountUp end={portfolio.initial_budget} duration={1.2} decimals={2} separator=" " suffix=" $" />
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Période : <b>{portfolio.holding_start}</b> → <b>{portfolio.holding_end}</b>
          </div>

          {/* Avatars cryptos */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {top.map((h) => (
                <Avatar key={h.id} className="h-7 w-7 ring-2 ring-white dark:ring-zinc-950">
                  <AvatarImage
                    src={h.crypto_detail?.image_url || ""}
                    alt={h.crypto_detail?.name || h.crypto_detail?.symbol || "crypto"}
                  />
                  <AvatarFallback>
                    {(h.crypto_detail?.symbol || "?").slice(0, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {extra > 0 && (
              <div className="grid h-7 w-7 place-items-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600 ring-2 ring-white dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-950">
                +{extra}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite : actions (pile en desktop, côte à côte en mobile) */}
        <div className="flex gap-2 md:flex-col md:items-end">
          <Button
            size="sm"
            className="gap-1 min-w-[120px]"
            onClick={() => simulate.mutate(portfolio.id)}
            disabled={simulate.isPending}
          >
            {simulate.isPending ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-20"/>
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" className="opacity-75"/>
              </svg>
            ) : (
              <Play className="h-4 w-4" />
            )}
            Simuler
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" className="gap-1 min-w-[120px]">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer « {portfolio.name} » ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Action irréversible. Les allocations et résultats liés seront supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => del.mutate(portfolio.id, { onSuccess: () => onDeleted?.() })}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

