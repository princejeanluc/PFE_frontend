"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
} from "recharts"

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoveUpRight } from "lucide-react"

// Génération de fausses données à fréquence élevée (toutes les 15 minutes)
function generateFakeCryptoData(start: Date, end: Date, intervalMinutes = 15) {
  const data = []
  let current = new Date(start)

  while (current <= end) {
    data.push({
      date: current.toISOString(),
      price: +(10000 + Math.random() * 500).toFixed(2),
    })
    current = new Date(current.getTime() + intervalMinutes * 60 * 1000)
  }

  return data
}

const now = new Date()
const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
const chartData = generateFakeCryptoData(threeMonthsAgo, now)

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--color-desktop)",
  },
} satisfies ChartConfig

export function ChartAreaCrypto() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7
    const startDate = new Date(referenceDate)
    startDate.setDate(referenceDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const latest = filteredData.at(-1)?.price ?? 0

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>
            <span className="font-bold text-2xl text-foreground">
              ${latest.toLocaleString("en-US")}
            </span>
          </CardTitle>
          <CardDescription>
            <span className="flex items-center">
              <span
                className="flex justify-start font-bold text-lg"
                style={{ color: "oklch(0.6 0.118 184.704)" }}
              >
                <MoveUpRight strokeWidth={3} /> 2,3%
              </span>
              &nbsp; derniers 24 h
            </span>
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={40}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
              padding={{ left: 10, right: 10 }}
            />
            <ChartTooltip
              cursor={{ stroke: "#ccc", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
