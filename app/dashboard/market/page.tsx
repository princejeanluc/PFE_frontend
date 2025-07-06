import React from 'react'
import Titlebar from '../_components/ui/titlebar'
import { ChartAreaInteractive } from '../_components/ui/chartareaInteractive'
import { ReturnAndTopCrypto } from '../_components/ui/returnandtopcrypto'
import MarketInfoCard from '../_components/ui/marketinfocard'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listCrypto } from '../_components/constants/constants'
import Image from 'next/image'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

function page() {
  return (
    <div className='p-4 grid grid-cols-1 gap-8 font-sans'>
      <div className='grid grid-rows-1 lg:grid-cols-5 gap-4 md:grid-cols-2'>
          {
            Array.from({ length: 5 }, (_, index) => index + 1).map((number)=>
            {
              return <MarketInfoCard key={number}></MarketInfoCard>
            })
          }
      </div>
      <div className='grid lg:grid-cols-5 md:grid-cols-1 gap-4'>
        <div className='grid grid-cols-1 gap-4 lg:col-span-3 items-start'>
          <Titlebar title={'Marché'}/>
          <div className=''>
            <ChartAreaInteractive></ChartAreaInteractive>
          </div>
        </div>
        <div className='grid  lg:col-span-2 grid-cols-1 gap-4'>
          <Titlebar title={'Rendement & Classement'}/>
          <div className=''>
            <ReturnAndTopCrypto></ReturnAndTopCrypto>
          </div>
        </div>
      </div>
      <div className='w-full h-fit'>
        <Card>
          <CardContent>
            <Table>
              <TableHeader >
                <TableRow >
                <TableHead className='font-medium text-lg text-primary '>Crypto</TableHead>
                <TableHead className='font-medium text-lg text-primary text-center'>Prix</TableHead>
                <TableHead className='font-medium text-lg text-primary text-center'>Rendement % (24H)</TableHead>
                <TableHead className='font-medium text-lg text-primary text-center'>Echanges </TableHead>
                <TableHead className='font-medium text-lg text-primary text-center'>Variation Attendue (H)</TableHead>
                <TableHead className='font-medium text-lg text-primary text-center'>Profit attendu (24H)</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
                {listCrypto.map(
                (crypto)=>{
                  return <TableRow key={crypto.label}>
                      <TableCell>
                        <div className='flex items-center flex-start gap-2 font-bold'>
                          <Image src={crypto.img_url} width={30} height={30} alt={crypto.label}></Image>
                          <span>{crypto.label}</span>
                        </div>
                        </TableCell>
                      <TableCell className='text-center'>${crypto.price}</TableCell>
                      <TableCell className='text-center'>{crypto.daily_return}</TableCell>
                      <TableCell className='text-center'>{crypto.trades}</TableCell>
                      <TableCell className='flex justify-center'>
                        {
                         crypto.expected_var>0 ? <TrendingUp className='bg-green-500 rounded-full text-white'/> : <TrendingDown className='bg-red-500 rounded-full text-white'/>
                        }
                      </TableCell>
                      <TableCell className='text-center'>$ {crypto.expected_profit}</TableCell>
                  </TableRow>
                }
              )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default page