'use client'
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Search } from 'lucide-react';
import React, { useState } from 'react'
import { usePortfolios } from '../../_lib/hooks/simulation';
import CreatePortfolioSheet from './createportfoliosheetT';
import PortefolioCard from './portefoliocard';
import { Skeleton } from '@/components/ui/skeleton';

function ListPortFolioComponent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [start , setStart] = useState("");
    const [end , setEnd] = useState("");
    const pageSize = 10;
    const { data: dataPortfolios, isLoading : isLoadingDataPortfolios,refetch } = usePortfolios({ page, pageSize, search, start, end });
  return (
    <div className='flex flex-col gap-4'>
            <div className='w-full h-fit flex justify-between  bg-white px-4 py-2 border-l-6 border-primary items-center rounded-sm gap-4 shadow-sm'>
                <span className='text-primary font-medium'>Portefeuilles</span>
                <div className='flex gap-2 items-center'>
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
                    <Search className='h-12 w-12'></Search>
                    <span>Début</span>
                    <input
                        type="date"
                        placeholder="start"
                        value={start}
                        onChange={(e) => {
                            setStart(e.target.value);
                            setPage(1); // reset à la première page si on fait une recherche
                        }}
                        className="p-2 border rounded-md text-sm  w-full max-w-xs "
                        />
                    <span>Fin</span>
                    <input
                        type="date"
                        placeholder="end"
                        value={end}
                        onChange={(e) => {
                            setEnd(e.target.value);
                            setPage(1); // reset à la première page si on fait une recherche
                        }}
                        className="p-2 border rounded-md text-sm  w-full max-w-xs "
                        />
                </div>
                <CreatePortfolioSheet onSuccess={() => refetch()}></CreatePortfolioSheet>
            </div>
            <div className=' p-8 bg-white rounded-sm shadow-sm'>
                <div className=' grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 h-100 overflow-scroll overflow-x-hidden'>
                    {isLoadingDataPortfolios ? (
                    <Skeleton className="w-full h-6" />
                  ) : (
                    dataPortfolios?.results.map((portfolio: any) =>(<PortefolioCard key={portfolio.id} portfolio={portfolio} ></PortefolioCard>)) )}
                </div>
            </div>
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
                {dataPortfolios?.next && (
                  <PaginationItem>
                    <PaginationNext href="#" onClick={() => setPage((prev) => prev + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
            
        </div>
  )
}

export default ListPortFolioComponent