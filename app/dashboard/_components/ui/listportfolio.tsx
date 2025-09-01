'use client'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CreatePortfolioSheet from './createportfoliosheetT'
import PortefolioCard from './portefoliocard'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { usePortfolios } from '../../_lib/hooks/simulation'

function useDebounced<T>(value: T, delay = 500) {
  const [v, setV] = useState(value)
  useEffect(() => { const id = setTimeout(() => setV(value), delay); return () => clearTimeout(id) }, [value, delay])
  return v
}

function ListPortFolioComponent() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pendingStart, setPendingStart] = useState('')
  const [pendingEnd, setPendingEnd] = useState('')
  const [sort, setSort] = useState<'created_desc'|'created_asc'|'name_asc'|'name_desc'>('created_desc')

  // valeurs “appliquées” (pas à chaque frappe)
  const [applied, setApplied] = useState({ start: '', end: '' })
  const debouncedSearch = useDebounced(search, 500)

  const pageSize = 12
  const { data: dataPortfolios, isLoading: isLoadingDataPortfolios, refetch, isFetching } =
    usePortfolios({ page, pageSize, search: debouncedSearch, start: applied.start, end: applied.end, sort })

  const onApplyFilters = () => { setApplied({ start: pendingStart, end: pendingEnd }); setPage(1) }
  const onResetFilters = () => { setPendingStart(''); setPendingEnd(''); setApplied({ start: '', end: '' }); setPage(1) }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-fit flex flex-wrap gap-3 justify-between bg-white px-4 py-3 border-l-4 border-primary items-center rounded-sm shadow-sm">
        <span className="text-primary font-medium">Portefeuilles</span>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher un portefeuille…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9 w-64"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Début</span>
            <Input type="date" value={pendingStart} onChange={(e) => setPendingStart(e.target.value)} className="w-40" />
            <span className="text-sm text-gray-600">Fin</span>
            <Input type="date" value={pendingEnd} onChange={(e) => setPendingEnd(e.target.value)} className="w-40" />
            <Button variant="secondary" onClick={onApplyFilters}>Appliquer</Button>
            <Button variant="outline" onClick={onResetFilters}>Réinitialiser</Button>
          </div>

          <Select value={sort} onValueChange={(v:any) => { setSort(v); setPage(1) }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Création ↓</SelectItem>
              <SelectItem value="created_asc">Création ↑</SelectItem>
              <SelectItem value="name_asc">Nom A→Z</SelectItem>
              <SelectItem value="name_desc">Nom Z→A</SelectItem>
            </SelectContent>
          </Select>

          <CreatePortfolioSheet onSuccess={() => refetch()} />
        </div>
      </div>

      <div className="p-4 bg-white rounded-sm shadow-sm">
        <div className="grid gap-4   md:h-64 [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))] overflow-y-scroll">
          {isLoadingDataPortfolios || isFetching
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-md bg-gray-200" />)
            : dataPortfolios?.results.map((p: any) => (
                <PortefolioCard key={p.id} portfolio={p} onDeleted={() => refetch()}/>
              ))
          }
          {!isLoadingDataPortfolios && dataPortfolios?.results?.length === 0 && (
            <div className="col-span-full text-sm text-gray-500">Aucun portefeuille trouvé avec ces critères.</div>
          )}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
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
