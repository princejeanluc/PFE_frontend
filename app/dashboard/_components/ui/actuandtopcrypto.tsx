"use client"

import { ListOrdered, Newspaper } from "lucide-react"
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

import { listTopCrypto } from "../constants/constants"
import NewsFeed from "./newsfeed"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from 'date-fns/locale';

export const description = "A line chart"



export function ActuAndTopCrypto() {
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
          <Table className="font-medium text-sm">

            <TableHeader className="text-foreground">
              <TableRow>
                <TableCell></TableCell><TableCell>Crypto</TableCell><TableCell>Prix</TableCell><TableCell>Rendement(24H)</TableCell>
              </TableRow>
            </TableHeader>
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
                          <TableCell className={cn("text-center", {"text-green-400":crypto.daily_return>=0,"text-red-400":crypto.daily_return<0})}>{crypto.daily_return}</TableCell>
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
