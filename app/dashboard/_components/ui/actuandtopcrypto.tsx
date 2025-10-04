"use client"

import { ListOrdered, Newspaper, TrendingDown, TrendingUp } from "lucide-react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useTopCryptos } from "../../_lib/hooks/market"
import NewsFeed from "./newsfeed"

export function ActuAndTopCrypto() {
  const { data, isLoading } = useTopCryptos()

  return (
    <Card className="shadow-md rounded-2xl border border-border/60 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Newspaper className="h-4 w-4" />
          <span>Actualités du marché</span>
        </div>
        <CardDescription className="text-[11px] text-muted-foreground">
          {format(Date.now(), "PPpp", { locale: fr })}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Section Actualités */}
        <div className="bg-muted/40 rounded-xl p-2 sm:p-3 hover:bg-muted/50 transition-colors">
          <NewsFeed />
        </div>

        {/* Section Classement */}
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <ListOrdered className="h-4 w-4" />
          <span>Classement (7 derniers jours)</span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/40">
            <Table className="text-xs sm:text-sm">
              <TableHeader>
                <TableRow className="bg-muted/30 text-foreground">
                  <TableCell className="text-center w-[50px]">Logo</TableCell>
                  <TableCell className="text-center">Symbole</TableCell>
                  <TableCell className="text-center">Prix</TableCell>
                  <TableCell className="text-center">Rendement (24h)</TableCell>
                  <TableCell className="text-center">Capitalisation</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.map((crypto: any) => (
                  <TableRow
                    key={crypto.symbol}
                    className={cn(
                      "transition-colors hover:bg-muted/20 cursor-pointer"
                    )}
                  >
                    <TableCell className="text-center">
                      <Image
                        src={crypto.image_url}
                        width={24}
                        height={24}
                        alt={crypto.name}
                        className="mx-auto rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-center">
                      {crypto.symbol.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-center">
                      ${crypto.current_price?.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-center font-medium flex items-center justify-center gap-1",
                        {
                          "text-green-500": crypto.price_change_24h >= 0,
                          "text-red-500": crypto.price_change_24h < 0,
                        }
                      )}
                    >
                      {crypto.price_change_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {crypto.price_change_24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {Intl.NumberFormat("en-US", {
                        notation: "compact",
                      }).format(crypto.market_cap)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
