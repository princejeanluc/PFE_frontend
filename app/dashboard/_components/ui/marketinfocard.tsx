import {
  Card,
  CardContent
} from "@/components/ui/card"
import React from 'react'
import { marketInfo } from "../types"
import { cn } from "@/lib/utils"
import { flagscolors } from "../constants/constants"
import { ArrowBigDown} from "lucide-react"

/*const marketinfo : marketInfo = {
    indicator: "agitation",
    indicatorValue: "Faible",
    message:"aujourd'hui le marché affiche un calme serein", 
    colorFlag: 3, 

}*/


function MarketInfoCard({marketinfo}) {
  return (
    <Card className="py-4 rounded-sm">
        <CardContent className="flex flex-col gap-2">
            <span className={cn("text-primary text-sm font-medium ")}>{marketinfo.indicator}</span>
            <div className={cn("text-2xl font-semibold")} >{marketinfo.indicatorValue}</div>
            <div className="text-gray-700  max-h-12 text-xs  text-justify">{marketinfo.message}</div>
        
            <div className="grid grid-cols-8 gap-1 items-end ">
                {Array.from({ length: 5 }, (_, index) => index).map(
                (number) =>{
                    const tmp : number = marketinfo.colorFlag-1
                return <div key = {number} className={cn("grid grid-cols-1",{
                                                            "col-span-4": number==tmp,
                                                            "justify-items-center": number==tmp,
                                                            "col-span-1": number!=tmp,
                                                         })}>
                            {number == tmp ? <ArrowBigDown  style ={{height:10, width:10}}/>: <div className="h-0"></div>}
                            <div  className={cn(`h-2 w-full rounded-md ` , {
                                                                                    "opacity-100": number==tmp, 
                                                                                    "opacity-15": number!=tmp, 
                                                                     }
                                                            )
                                                        }
                            style={{background: flagscolors[number]}}></div>
                        </div>
                            }
                                                                    )
                }
            </div>
        </CardContent>
    </Card>
  )
}

export default MarketInfoCard