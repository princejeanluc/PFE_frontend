"use client"

import { ListOrdered, Newspaper, TrendingDown, TrendingUp } from "lucide-react"
import Image from 'next/image'
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
import NewsFeed from "./newsfeed"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from 'date-fns/locale';
import { useTopCryptos } from "../../_lib/hooks/market"




export function ActuAndTopCrypto() {
  const {data , isLoading} = useTopCryptos();
  return (
    <Card className="">
      <CardHeader>
        <div className="flex gap-2 leading-none font-medium text-sm items-center text-primary">
           <Newspaper  className="h-4 w-4" /> Actualité
        </div>
        <CardDescription className="text-xs">{format(Date.now(),"PPpp", { locale: fr})}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 ">
        <NewsFeed></NewsFeed>
        <div className="flex gap-2 leading-none font-medium text-sm items-center text-primary">
          <ListOrdered   className="h-4 w-4"/> Classement 7 derniers jours 
        </div>
        <div className="text-muted-foreground leading-none">
          {isLoading ? <span>{"is Loading"}</span>  : 
          <Table className="font-medium text-sm">
            <TableHeader className="text-foreground">
              <TableRow>
                <TableCell></TableCell><TableCell className="text-center">Crypto</TableCell><TableCell className="text-center">Prix</TableCell><TableCell className="text-center">Rendement(24H)</TableCell><TableCell className="text-center">Capitalisation marché</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(
                (crypto)=>{
                  return <TableRow className="bg-side-bar" key ={crypto.symbol}>
                            <TableCell className="font-medium text-center text-black">
                              <Image src={crypto.image_url} width={30} height={30} alt={crypto.slug}></Image>
                            </TableCell>
                            <TableCell className="font-medium text-center text-black">{crypto.symbol}</TableCell>
                            <TableCell className="font-medium text-center text-black">$ {crypto.current_price?.toFixed(2)}</TableCell>
                            <TableCell className={cn("flex text-center items-center gap-2", {"text-green-400":crypto.price_change_24h>=0,"text-red-400":crypto.price_change_24h<0})}> {crypto.price_change_24h>0 ? <TrendingUp></TrendingUp>: <TrendingDown></TrendingDown>}{crypto.price_change_24h} %</TableCell>
                            <TableCell>{Math.round(crypto.market_cap)}</TableCell>
                          </TableRow>
                }
              )}
           </TableBody>
          </Table>
          
          }
          
        </div>
        </CardContent>
    </Card>
  )
}
