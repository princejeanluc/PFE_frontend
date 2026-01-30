import type { AxiosError } from "axios";
import { api } from "@/core/http/api";

export const getMarketSnapshot = async () => {
  const response = await api.get("/api/market/snapshot/");
  return response.data;
};

export const getCryptoList = async (pageSize: number = 30) => {
  const params = new URLSearchParams({
    page_size: pageSize.toString(),
  });
  const response = await api.get(`/api/cryptos/?${params.toString()}`);
  return response.data;
};

export const getMarketIndicators = async () => {
  try {
    const response = await api.get("/api/market/indicators/");
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des indicateurs ${error}`);
  }
};

export const getCryptoChartData = async (symbol: string, range: string, signal?: AbortSignal) => {
  try {
    const url = `/api/market/history/?symbol=${encodeURIComponent(symbol)}&range=${encodeURIComponent(
      range
    )}`;
    const response = await api.get(url, { signal });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    const serverMessage = error?.response?.data ?? error?.message ?? String(error);
    throw new Error(`Erreur lors du chargement des données du graphique: ${serverMessage}`);
  }
};

export const getLatestCryptoInfo = async ({
  page = 1,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) params.append("search", search);

    const response = await api.get(`/api/cryptos/latest-info/?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des dernières données des cryptos ${error}`);
  }
};

export const getPorfolios = async () => {
  try {
    const response = await api.get("/api/portfolios/");
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des portfolios ${error}`);
  }
};

export const getLatestNews = async () => {
  try {
    const response = await api.get("/api/news/latest/");
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des actualités récentes ${error}`);
  }
};

export const getTopCryptos = async () => {
  try {
    const response = await api.get("/api/crypto-infos/top/");
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors du chargement des top cryptos ${error}`);
  }
};
