"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
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
import {  MoveDownLeft, MoveUpRight } from "lucide-react"
import { useCryptoChartData, useCryptoList } from "../../_lib/hooks/market"

export const description = "An interactive area chart"
const chartConfig = {
  price: {
    label: "Prix",
    color: "var(--chart-1)", // Tu peux mettre une couleur personnalisée ici
  },
} satisfies ChartConfig;
type crypto ={
  id: string;
  symbol : string;
  name:string;
  slug: string;
  image_url:string;
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [selectedSymbol, setSelectedSymbol] = React.useState("BTC")

  const { data, isLoading, error } = useCryptoChartData(selectedSymbol, timeRange)
  const { data:cryptoList, isLoading:isLoadingCryptoList, error:errorCryptoList } = useCryptoList()
  if(cryptoList) console.log(cryptoList)

  const chartData = React.useMemo(() => {
    if (!data || !data.history) return []
    return data.history.map((item: any) => ({
      date: item.timestamp,
      price: item.price,  
    }))
  }, [data])
  
  return (
    <div className="flex flex-col h-full gap-2 ">
      <Card className="rounded-md p-2 ">
        <CardContent className="flex justify-between items-center text-sm">
          <span>Selectionner </span>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="btc" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cryptomonnaies</SelectLabel>
                {isLoadingCryptoList ? (<SelectItem value="BTC">Bitcoin</SelectItem>) :  errorCryptoList ?  (<SelectItem value="BTC">Bitcoin</SelectItem>) : 
                cryptoList?.results.map( (crypto:crypto)=>(<SelectItem value={`${crypto.symbol}`} key={crypto.symbol} >{crypto.name}</SelectItem>)
                                ) }
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="w-full h-full px-2 rounded-md">
        <CardHeader className="flex items-center gap-2 space-y-0 py-0 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>
              <span className="font-bold text-2xl text-foreground">
                {isLoading ? "Chargement..." : `$${data?.current_price?.toLocaleString() ?? "N/A"}`}
              </span>
            </CardTitle>
            <CardDescription>
              <span className="flex gap-0.5 items-center">
                <span className={`flex items-center justify-start font-normal text-md ${data?.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {data?.price_change_percentage_24h >= 0 ? <MoveUpRight /> : <MoveDownLeft />}
                  {data?.price_change_percentage_24h?.toFixed(2)}%
                </span>
                &nbsp;dernières 24 h
              </span>
            </CardDescription>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto sm:flex">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="120d">Last 6 months</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 sm:pt-6 h-full" >
          {isLoading ? (
            <p>Chargement du graphique...</p>
          ) : error ? (
            <p className="text-red-500">Erreur lors du chargement des données.</p>
          ) : (
          <ResponsiveContainer className={"h-full w-full"}>
            <ChartContainer config={chartConfig}  className="h-90">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <ChartTooltip
                  cursor={true}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute:"2-digit"
                        })
                      }
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="price"
                  type="natural"
                  fill="url(#fillPrice)"
                  stroke="var(--chart-2)"
                  stackId="a"
                />
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
