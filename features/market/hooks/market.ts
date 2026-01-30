import { useQuery } from "@tanstack/react-query";
import {
  getCryptoChartData,
  getCryptoList,
  getLatestCryptoInfo,
  getLatestNews,
  getMarketIndicators,
  getPorfolios,
  getTopCryptos,
} from "@/features/market/api/market";

export const useMarketIndicators = () =>
  useQuery({
    queryKey: ["market-indicators"],
    queryFn: async () => getMarketIndicators(),
    staleTime: 1000 * 60 * 5,
  });

export const useCryptoChartData = (symbol: string, range: string) =>
  useQuery({
    queryKey: ["crypto-chart-data", symbol, range],
    queryFn: async ({ signal }) => {
      if (!symbol) return null;
      return getCryptoChartData(symbol, range, signal);
    },
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(symbol),
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

export const useCryptoList = () =>
  useQuery({
    queryKey: ["crypto-list"],
    queryFn: () => getCryptoList(),
    staleTime: 1000 * 60 * 5,
  });

export const useLatestCryptoInfo = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search: string;
}) =>
  useQuery({
    queryKey: ["latest-crypto-info", page, pageSize, search],
    queryFn: () => getLatestCryptoInfo({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5,
  });

export const usePortfolios = () =>
  useQuery({
    queryKey: ["portfolios"],
    queryFn: () => getPorfolios(),
    staleTime: 1000 * 60 * 5,
  });

export const useLatestNews = () =>
  useQuery({
    queryKey: ["latest-news"],
    queryFn: getLatestNews,
    staleTime: 1000 * 60 * 3,
  });

export const useTopCryptos = () =>
  useQuery({
    queryKey: ["top-cryptos"],
    queryFn: getTopCryptos,
    staleTime: 1000 * 60 * 5,
  });
