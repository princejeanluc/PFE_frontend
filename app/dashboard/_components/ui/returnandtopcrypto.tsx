"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { listTopCrypto } from "../constants/constants"


export const description = "A line chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ReturnAndTopCrypto() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Rendements</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex gap-2 leading-none font-medium">
          Classement 7 derniers jours <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          <Table className="">

            <TableBody>
            {listTopCrypto.map(
              (crypto)=>{
                return <TableRow className="bg-side-bar" key ={crypto.label}>
                          <TableCell className="font-medium">
                            <Image src={crypto.img_url} width={30} height={30} alt={crypto.label}>
                            </Image>
                          </TableCell>
                          <TableCell>{crypto.label}</TableCell>
                          <TableCell>$ {crypto.price}</TableCell>
                          <TableCell className="text-right">{crypto.daily_return}</TableCell>
                        </TableRow>
              }
            )}
          </TableBody>
          </Table>
        </div>
        </CardContent>
    </Card>
  )
}
