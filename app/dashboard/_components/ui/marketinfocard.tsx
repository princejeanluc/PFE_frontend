import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from 'react'
import { marketInfo } from "../types"
import { cn } from "@/lib/utils"
import { flagscolors } from "../constants/constants"

const marketinfo : marketInfo = {
    indicator: "agitation",
    indicatorValue: "Faible",
    message:"aujourd'hui le marché affiche un calme serein", 
    colorFlag: 5, 

}


function MarketInfoCard() {
  return (
    <Card className="py-4 lg:h-64">
        <CardHeader>
            <CardTitle>
            <span className="text-primary text-lg">{marketinfo.indicator}</span>
            </CardTitle>
            <CardDescription>
<div className="text-3xl font-semibold">{marketinfo.indicatorValue}</div>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-foreground h-18 ">{marketinfo.message}</div>
        </CardContent>
        <CardFooter>
        <div className="grid grid-cols-6 gap-1 w-full ">
            {Array.from({ length: 5 }, (_, index) => index).map(
            (number) =>{
                const tmp : number = marketinfo.colorFlag-1
            return <div key = {number} className={cn(`md:h-1 lg:h-3 w-full rounded-lg ` , {
                "opacity-100": number==tmp, 
                "opacity-15": number!=tmp, 
                "col-span-2": number==tmp,
                "col-span-1": number!=tmp,
            })} style={{background: flagscolors[number]}}>. </div>
            }
            )}
        </div>
        </CardFooter>
    </Card>
  )
}

export default MarketInfoCard