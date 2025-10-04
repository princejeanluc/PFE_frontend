// dashboard/_lib/hooks/market.ts
import { useQuery } from "@tanstack/react-query";
import { getCryptoChartData, getCryptoList, getLatestCryptoInfo, getLatestNews, getMarketIndicators, getPorfolios, getTopCryptos } from "../api/market";

export const useMarketIndicators = () => {
  return useQuery({
    queryKey: ["market-indicators"],
    queryFn: async () => {
        const data = getMarketIndicators(); 
        console.log("data", data)
        return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCryptoChartData = (symbol: string, range: string) => {
  return useQuery({
    queryKey: ["crypto-chart-data", symbol, range],
    // queryFn reçoit un param context qui contient signal (AbortSignal)
    queryFn: async ({ signal }) => {
      // si symbol est vide, on peut renvoyer null / throw pour éviter appel inutile
      if (!symbol) return null;
      return getCryptoChartData(symbol, range, signal);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: Boolean(symbol), // n'exécute pas la requête si symbol falsy
    retry: 2,                 // retry court (configurable)
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
  });
};

export const useCryptoList = () => {
  return useQuery({
    queryKey: ["crypto-list"],
    queryFn: () => getCryptoList(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLatestCryptoInfo = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search: string;
}) => {
  return useQuery({
    queryKey: ["latest-crypto-info", page, pageSize, search],
    queryFn: () => getLatestCryptoInfo({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePorfolios = () => {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: () => getPorfolios(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};


export const useLatestNews = () => {
  return useQuery({
    queryKey: ["latest-news"],
    queryFn: getLatestNews,
    staleTime: 1000 * 60 * 3,
  });
};

export const useTopCryptos = () => {
  return useQuery({
    queryKey: ["top-cryptos"],
    queryFn: getTopCryptos,
    staleTime: 1000 * 60 * 5,
  });
};