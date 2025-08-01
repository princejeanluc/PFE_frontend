// dashboard/_lib/hooks/simulation.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { createHoldings, createPortfolio, getCryptoMap, getCryptoRelations, getCryptoReturnsForPortfolio, getPortfolio, HoldingData, PortfolioData, simulatePortfolio } from "../api/simulation";
import { getPortfolios } from "../api/simulation";
import { getTopCryptos } from "../api/market";


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
  end
}: {
  page: number;
  pageSize: number;
  search: string;
  start: string;
  end: string;
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
  return useMutation({
    mutationFn: async (id: number) => simulatePortfolio(id),
  });
};

export const useCryptoReturnsForPortfolio = (portfolioId: number | string) => {
  return useQuery({
    queryKey: ["crypto-returns", portfolioId],
    queryFn: async () => getCryptoReturnsForPortfolio(Number(portfolioId)),
    staleTime: 1000 * 60 * 10, // 10 min
  });
};

export const useTopCryptos = () => {
  return useQuery({
    queryKey: ["top-cryptos"],
    queryFn: getTopCryptos,
    staleTime: 1000 * 60 * 5,
  });
};