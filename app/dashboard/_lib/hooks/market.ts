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
    queryFn: () => getCryptoChartData(symbol, range),
    staleTime: 1000 * 60 * 5, // 5 minutes
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