import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { flagscolors } from "@/shared/constants/constants";
import { ArrowBigDown } from "lucide-react";

function MarketInfoCard({ marketinfo }: { marketinfo: any }) {
  return (
    <Card className="py-4 rounded-sm">
      <CardContent className="flex flex-col gap-2">
        <span className={cn("text-primary text-sm font-medium ")}>{marketinfo.indicator}</span>
        <div className={cn("text-2xl font-semibold")}>{marketinfo.indicatorValue}</div>
        <div className="text-gray-700 h-8 max-h-8 text-xs text-justify">{marketinfo.message}</div>

        <div className="grid grid-cols-8 gap-1 items-end">
          {Array.from({ length: 5 }, (_, index) => index).map((number) => {
            const tmp: number = marketinfo.colorFlag - 1;
            return (
              <div
                key={number}
                className={cn("grid grid-cols-1", {
                  "col-span-4": number == tmp,
                  "justify-items-center": number == tmp,
                  "col-span-1": number != tmp,
                })}
              >
                {number == tmp ? <ArrowBigDown style={{ height: 10, width: 10 }} /> : <div className="h-0" />}
                <div
                  className={cn("h-2 w-full rounded-md ", {
                    "opacity-100": number == tmp,
                    "opacity-15": number != tmp,
                  })}
                  style={{ background: flagscolors[number] }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketInfoCard;
