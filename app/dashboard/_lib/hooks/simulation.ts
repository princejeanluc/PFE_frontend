// dashboard/_lib/hooks/simulation.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHoldings, createPortfolio, deletePortfolio, getCryptoMap, getCryptoRelations, getCryptoReturnsForPortfolio, getPortfolio, HoldingData, PortfolioData, simulatePortfolio } from "../api/simulation";
import { getPortfolios } from "../api/simulation";
import { toast } from "sonner";


export const useCryptoRelations = (type: string, period: string, lag: number) => {
  return useQuery({
    queryKey: ["crypto-relation-data",type,  period, lag],
    queryFn: async () => getCryptoRelations(type,  period, lag),
        staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCryptoMap = () => {
  return useQuery({
    queryKey: ["crypto-relation-data"],
    queryFn: async () => getCryptoMap(),
        staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreatePortfolio = () => {
  return useMutation({
    mutationFn: async (data: PortfolioData) => createPortfolio(data),
  })
}

export const useCreateHoldings = () => {
  return useMutation({
    mutationFn: async (data: HoldingData[]) => createHoldings(data),
  })
}

export const usePortfolios = ({
  page,
  pageSize,
  search,
  start, 
  end,
}: {
  page: number;
  pageSize: number;
  search: string;
  start: string;
  end: string;
  sort:string;
}) => {
  return useQuery({
    queryKey: ["portfolios", page, pageSize, search, start , end],
    queryFn: async () => getPortfolios({ page, pageSize, search , start, end}),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePortfolio = ({id}:{id:number|string})=>{
  return useQuery({
    queryKey:["portfolio",id], 
    queryFn: async ()=> getPortfolio({id}), 
    staleTime : 1000*60*5
  })
}



export const useSimulatePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => simulatePortfolio(id),
    onSuccess: (_data, id) => {
      // force un refetch immédiat
      qc.invalidateQueries({ queryKey: ["portfolio", id] })
      qc.invalidateQueries({ queryKey: ["portfolio-returns", id] })
    },
    onError: (err: any) => {
      // axios
      const msg = err?.response?.data?.error || err?.message || "Échec de la simulation"
      toast.error(msg)
    }
  })
}

export const useCryptoReturnsForPortfolio = (portfolioId: number | string) => {
  return useQuery({
    queryKey: ["crypto-returns", portfolioId],
    queryFn: async () => getCryptoReturnsForPortfolio(Number(portfolioId)),
    staleTime: 1000 * 60 * 10, // 10 min
  });
};

export const useDeletePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePortfolio(id),
    onSuccess: (_data, id) => {
      // rafraîchir la liste et le détail si ouverts
      qc.invalidateQueries({ queryKey: ["portfolios"] });
      qc.invalidateQueries({ queryKey: ["portfolio", id] });
      qc.invalidateQueries({ queryKey: ["crypto-returns", id] });
      toast.success("Portefeuille supprimé.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Suppression impossible.");
    },
  });
};