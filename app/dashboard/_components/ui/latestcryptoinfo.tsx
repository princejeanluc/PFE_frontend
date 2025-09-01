import React, { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useLatestCryptoInfo } from '../../_lib/hooks/market'
import Titlebar from './titlebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const nfPct = (x?: number | null) => (x == null ? '—' : `${x.toFixed(2)} %`)
const nfInt = new Intl.NumberFormat('en-US')

type Pred = { model_name: string; predicted_price?: number; predicted_log_return?: number }

const pickPred = (preds: Pred[] | undefined, model: 'gru' | 'xgboost') =>
  preds?.find(p => p.model_name.toLowerCase() === model)



// ✅ lr_pct = ln(P_{t+1}/P_t) * 100
const pctFromLogRet100 = (lr_pct?: number | null) =>
  lr_pct == null ? null : (Math.exp(lr_pct / 100) - 1) * 100;

// Profit attendu sur 1 unité avec le log-return XGB
const profitFromLogRet100 = (price?: number | null, lr_pct?: number | null) =>
  price == null || lr_pct == null ? null : price * (Math.exp(lr_pct / 100) - 1);


export default function LatestCryptoInfoComponent() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const pageSize = 10
  const { data: dataCryptoLatest, isLoading: isLoadingDataCryptoLatest } =
    useLatestCryptoInfo({ page, pageSize, search })

  // petites lignes squelette
  const RowSkeleton = () => (
    <TableRow>
      <TableCell colSpan={7}><Skeleton className="w-full h-6 bg-gray-200" /></TableCell>
    </TableRow>
  )

  return (
    <div className="grid grid-cols-1 gap-4">
      <Titlebar title={'Cryptomonnaies'} />
      <div className="bg-white rounded-sm flex items-center justify-center w-full py-2">
        <input
          type="text"
          placeholder="Rechercher une crypto…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="p-2 border rounded-md text-sm w-full max-w-xs"
        />
      </div>

      <div className="w-full h-fit">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-sm text-primary">Crypto</TableHead>
                  <TableHead className="font-medium text-sm text-primary text-center">Prix</TableHead>
                  <TableHead className="font-medium text-sm text-primary text-center">Rendement % (24h)</TableHead>
                  <TableHead className="font-medium text-sm text-primary text-center">Rang (Cap.)</TableHead>
                  <TableHead className="font-medium text-sm text-primary text-center">Offre en circulation</TableHead>
                  <TableHead className="font-medium text-sm text-primary text-center">
                    Variation attendue (1h) <span className="text-[10px] text-gray-500">(GRU)</span>
                  </TableHead>
                  <TableHead className="font-medium text-sm text-primary text-center">
                    Profit attendu (1h) <span className="text-[10px] text-gray-500">(XGBoost, 1 unité)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoadingDataCryptoLatest && Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)}

                {!isLoadingDataCryptoLatest && dataCryptoLatest?.results?.map((c: any) => {
                  const price = c.latest_info?.current_price ?? null
                  const ret24 = c.latest_info?.return_24h ?? null

                  // --- sélection des prédictions
                  const gru = pickPred(c.latest_predictions, 'gru');
                  const xgb = pickPred(c.latest_predictions, 'xgboost');

                  // --- variation % (1h) via GRU
                  const var1hPct = pctFromLogRet100(gru?.predicted_log_return); // %

                  // --- profit attendu (1h) : priorité à predicted_price sinon log-return XGB
                  const profit1h =
                    xgb?.predicted_price != null && price != null
                      ? (xgb.predicted_price - price)
                      : profitFromLogRet100(price, xgb?.predicted_log_return);

                  // --- accord/désaccord des modèles (sens)
                  const gruDir = var1hPct == null ? null : Math.sign(var1hPct); // même signe que lr_pct
                  const xgbDir =
                    xgb?.predicted_price != null && price != null
                      ? Math.sign(xgb.predicted_price - price)
                      : (xgb?.predicted_log_return == null ? null : Math.sign(xgb.predicted_log_return));
                  const disagree = (xgbDir != null && gruDir != null && xgbDir !== 0 && gruDir !== 0) ? (xgbDir !== gruDir) : false;
                  const predicted_date = (new Date(c.latest_predictions[0]?.predicted_date)).toLocaleString() || "NA";

                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-semibold text-sm">
                          <Image src={c.image_url} width={18} height={18} alt={c.name} className="rounded-full" />
                          <span>{c.name}</span>
                          <span className="text-xs text-gray-500 uppercase">({c.symbol})</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-xs">
                        {price == null ? 'N/A' : nfUSD.format(price)}
                      </TableCell>

                      <TableCell className="text-center text-xs">
                        {nfPct(ret24)}
                      </TableCell>

                      <TableCell className="text-center text-xs">
                        {c.latest_info?.market_cap_rank ?? '—'}
                      </TableCell>

                      <TableCell className="text-center text-xs">
                        {c.latest_info?.circulating_supply != null ? nfInt.format(c.latest_info.circulating_supply) : '—'}
                      </TableCell>

                      <TableCell className="text-center text-xs">
                        <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {var1hPct == null ? (
                                      <span className="text-gray-400">—</span>
                                    ) : var1hPct > 0 ? (
                                      <span className="inline-flex items-center gap-1 text-green-600">
                                        {var1hPct.toFixed(2)} % 
                                            <TrendingUp className="h-4 w-4" />
                                        
                                      </span>
                                    ) : var1hPct < 0 ? (
                                      <span className="inline-flex items-center gap-1 text-red-600">
                                        {var1hPct.toFixed(2)} % <TrendingDown className="h-4 w-4" />
                                      </span>
                                    ) : '0.00 %'}
                                    {disagree && (
                                      <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-amber-600">
                                        <AlertTriangle className="h-3 w-3" /> désaccord
                                      </span>
                                    )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-xs"><span>{predicted_date }</span></TooltipContent>
                            </Tooltip>
                      </TableCell>

                      <TableCell className="text-center text-xs">
                        {profit1h == null ? (
                          <span className="text-gray-400">—</span>
                        ) : profit1h > 0 ? (
                          <span className="inline-flex items-center gap-1 text-green-700">
                            {nfUSD.format(profit1h)} <TrendingUp className="h-4 w-4" />
                          </span>
                        ) : profit1h < 0 ? (
                          <span className="inline-flex items-center gap-1 text-red-700">
                            {nfUSD.format(profit1h)} <TrendingDown className="h-4 w-4" />
                          </span>
                        ) : nfUSD.format(0)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>

          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(p - 1, 1))} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{page}</PaginationLink>
                </PaginationItem>
                {dataCryptoLatest?.next && (
                  <PaginationItem>
                    <PaginationNext href="#" onClick={() => setPage((p) => p + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
