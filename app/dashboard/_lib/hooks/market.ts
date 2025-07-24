import { useQuery } from "@tanstack/react-query";
import { getCryptoChartData, getCryptoList, getLatestCryptoInfo, getMarketIndicators, getPorfolios } from "../api/market";

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