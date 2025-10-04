"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, Tooltip, Brush } from "recharts"
import debounce from "lodash/debounce"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoveDownLeft, MoveUpRight, RefreshCw } from "lucide-react"
import { useCryptoChartData, useCryptoList } from "../../_lib/hooks/market"
import Image from "next/image"

const chartConfig = {
  price: { label: "Prix", color: "var(--chart-1)" },
} satisfies ChartConfig;

type Crypto = {
  id: string;
  symbol: string;
  name: string;
  slug: string;
  image_url: string;
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [selectedSymbol, setSelectedSymbol] = React.useState("BTC")
  const [query, setQuery] = React.useState("") // for searchable select

  const { data, isLoading, error, refetch } = useCryptoChartData(selectedSymbol, timeRange)
  const { data: cryptoList, isLoading: isLoadingCryptoList, error: errorCryptoList } = useCryptoList()

  // debounce updates when user change selects quickly
  const debouncedSetSymbol = React.useMemo(() => debounce((v: string) => setSelectedSymbol(v), 300), [])
  React.useEffect(() => () => debouncedSetSymbol.cancel(), [debouncedSetSymbol])

  // Map chart data
  const chartData = React.useMemo(() => {
    if (!data?.history) return []
    return data.history.map((item: any) => ({
      date: item.timestamp,
      price: item.price,
    }))
  }, [data])

  // Compute mini-stats
  const stats = React.useMemo(() => {
    if (!chartData.length) return null
    const prices = chartData.map((d:any) => Number(d.price))
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [chartData])

  // format date according to range
  const tickFormatter = (value: string) => {
    const d = new Date(value)
    if (timeRange === "1d") return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  // searchable list filtered
  const options = React.useMemo(() => {
    if (!cryptoList?.results) return []
    const q = query.trim().toLowerCase()
    return cryptoList.results.filter((c: Crypto) =>
      !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    )
  }, [cryptoList, query])

  return (
    <div className="flex flex-col gap-3">
      {/* selector card */}
      <Card className="rounded-md p-2">
        <CardContent className="flex gap-2 items-center">
          <label htmlFor="crypto-search" className="sr-only">Sélectionner une crypto</label>
          <div className="flex-1">
            <input
              id="crypto-search"
              placeholder="Rechercher une cryptomonnaie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              aria-label="Rechercher une cryptomonnaie"
            />
          </div>

          <div className="w-[220px]">
            <Select value={selectedSymbol} onValueChange={(v) => debouncedSetSymbol(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cryptomonnaies</SelectLabel>
                  {isLoadingCryptoList ? (
                    <SelectItem value="BTC">Chargement...</SelectItem>
                  ) : errorCryptoList ? (
                    <SelectItem value="BTC">Bitcoin</SelectItem>
                  ) : (
                    options.map((c: Crypto) => (
                      <SelectItem key={c.symbol} value={c.symbol} className="flex items-center gap-2">
                        <Image src={c.image_url} alt={c.name} className="w-5 h-5 rounded-full" width={20} height={20}/>
                        <span className="truncate">{c.name} <span className="text-xs opacity-70">({c.symbol.toUpperCase()})</span></span>
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* main chart card */}
      <Card className="w-full h-full px-2 rounded-md">
        <CardHeader className="flex items-center gap-2 py-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-3">
              <div>
                {isLoading ? (
                  <div className="animate-pulse w-40 h-7 bg-slate-200 rounded" />
                ) : (
                  <span className="font-bold text-2xl text-foreground">
                    ${data?.current_price?.toLocaleString() ?? "N/A"}
                  </span>
                )}
              </div>

              <div className={`text-sm flex items-center gap-1 ${data?.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                {isLoading ? <div className="w-12 h-4 bg-slate-200 animate-pulse rounded" /> : (
                  <>
                    {data?.price_change_percentage_24h >= 0 ? <MoveUpRight /> : <MoveDownLeft />}
                    {data?.price_change_percentage_24h?.toFixed(2)}%
                  </>
                )}
              </div>
            </CardTitle>

            <CardDescription>
              <div className="flex gap-3 items-center text-xs text-muted-foreground">
                <div>Variation 24h</div>
                {stats && <div>Min: ${stats.min.toLocaleString()}</div>}
                {stats && <div>Max: ${stats.max.toLocaleString()}</div>}
              </div>
            </CardDescription>
          </div>

          <div className="flex gap-2 items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="120d">6 mois</SelectItem>
                <SelectItem value="90d">3 mois</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="1d">1 jour</SelectItem>
              </SelectContent>
            </Select>

            <button
              aria-label="Rafraîchir"
              className="p-2 rounded-md hover:bg-slate-100"
              onClick={() => { refetch?.() }}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 sm:pt-6 h-full">
          {isLoading ? (
            // skeleton area for chart
            <div className="animate-pulse space-y-3">
              <div className="w-full h-56 bg-slate-100 rounded" />
              <div className="flex gap-2">
                <div className="w-24 h-4 bg-slate-100 rounded" />
                <div className="w-16 h-4 bg-slate-100 rounded" />
              </div>
            </div>
          ) : error ? (
            <div className="text-red-600 flex flex-col gap-2">
              <div>Erreur lors du chargement des données.</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { refetch?.() }}>
                  Réessayer
                </button>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <ChartContainer config={chartConfig}>
                <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={20}
                    tickFormatter={tickFormatter}
                  />

                  <Tooltip
                    // fallback sur ChartTooltip si tu veux style custom
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Prix"]}
                    labelFormatter={(label: string) => new Date(label).toLocaleString()}
                  />

                  <Area dataKey="price" type="natural" fill="url(#fillPrice)" stroke="var(--chart-2)" dot={false} />

                  {/* Brush pour selection/zoom */}
                  <Brush dataKey="date" height={30} stroke="var(--chart-2)" travellerWidth={8} />

                  <ChartLegend content={<ChartLegendContent payload={undefined} />} />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
