import React, { useState } from 'react'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useLatestCryptoInfo } from '../../_lib/hooks/market'
import Titlebar from './titlebar'
import { Skeleton } from '@/components/ui/skeleton'


function LatestCryptoInfoComponent() {
      const [page, setPage] = useState(1);
      const [search, setSearch] = useState("");
      const pageSize = 10;
      const { data: dataCryptoLatest, isLoading : isLoadingDataCryptoLatest } = useLatestCryptoInfo({ page, pageSize, search });
  return (
    <div className='grid grid-cols-1 gap-4'>
        
      <Titlebar title={'Cryptomonnaies'}/>
      <div className='bg-white rounded-sm  flex  items-center justify-center w-full py-2'>
        <input
          type="text"
          placeholder="Rechercher une crypto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset à la première page si on fait une recherche
          }}
          className="p-2 border rounded-md text-sm  w-full max-w-xs "
        />
      </div>
      <div className='w-full h-fit'>
        <Card>
          <CardContent>
            <Table>
              <TableHeader >
                <TableRow >
                <TableHead className='font-medium text-sm text-primary '>Crypto</TableHead>
                <TableHead className='font-medium text-sm text-primary text-center'>Prix</TableHead>
                <TableHead className='font-medium text-sm text-primary text-center'>Rendement % (24H)</TableHead>
                <TableHead className='font-medium text-sm text-primary text-center'>Echanges </TableHead>
                <TableHead className='font-medium text-sm text-primary text-center'>Variation Attendue (H)</TableHead>
                <TableHead className='font-medium text-sm text-primary text-center'>Profit attendu (24H)</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
                  {isLoadingDataCryptoLatest ? (
                    <TableRow><TableCell colSpan={6}><Skeleton className="w-full h-6" /></TableCell></TableRow>
                  ) : (
                    dataCryptoLatest?.results.map((crypto: any) => (
                      <TableRow key={crypto.id}>
                        <TableCell>
                          <div className='flex items-center gap-2 font-bold text-xs'>
                            <Image src={crypto.image_url} width={12} height={12} alt={crypto.name} />
                            <span>{crypto.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className='text-center text-xs'>
                          ${crypto.latest_info?.current_price?.toFixed(2) ?? "N/A"}
                        </TableCell>
                        <TableCell className='text-center text-xs'>
                          {crypto.latest_info?.daily_return ?? "-"}%
                        </TableCell>
                        <TableCell className='text-center text-xs'>
                          ${crypto.latest_info?.volume?.toLocaleString() ?? "N/A"}
                        </TableCell>
                        <TableCell className='text-center text-xs'>
                          {crypto.latest_info?.volatility_24h > 0 ? (
                            <TrendingUp className='bg-green-500 rounded-full text-white m-auto' style={{ height: 16, width: 16 }} />
                          ) : (
                            <TrendingDown className='bg-red-500 rounded-full text-white m-auto' style={{ height: 16, width: 16 }} />
                          )}
                        </TableCell>
                        <TableCell className='text-center text-xs'>
                          ${((crypto.latest_info?.current_price ?? 0) * (crypto.latest_info?.daily_return ?? 0) / 100).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{page}</PaginationLink>
                </PaginationItem>
                {dataCryptoLatest?.next && (
                  <PaginationItem>
                    <PaginationNext href="#" onClick={() => setPage((prev) => prev + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LatestCryptoInfoComponent