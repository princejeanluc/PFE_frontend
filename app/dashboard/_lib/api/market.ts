// dashboard/_lib/api/market.ts

import {api} from './index'

export const getMarketSnapshot = async () => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/snapshot/`);
  return response.data;
};

export const getCryptoList = async () => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cryptos/`);
  return response.data;
};

export const getMarketIndicators = async ()=>{

    try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/indicators/`);
        return response.data;
      } catch (error) {
        throw new Error("Erreur lors du chargement des indicateurs");
      }
}


export const getCryptoChartData = async (symbol: string, range: string) => {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/history/?symbol=${symbol}&range=${range}`);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors du chargement des données du graphique");
  }
};


export const getLatestCryptoInfo = async ({
  page = 1,
  pageSize = 10,
  search = "",
}: { page?: number; pageSize?: number; search?: string }) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) params.append("search", search);

    const response = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cryptos/latest-info/?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors du chargement des dernières données des cryptos");
  }
};


export const getPorfolios = async () => {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/`);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors du chargement des portfolios");
  }
};


export const getLatestNews = async () => {
  try {
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news/latest/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors du chargement des actualités récentes");
  }
};

export const getTopCryptos = async () => {
  try {
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crypto-infos/top/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors du chargement des top cryptos");
  }
};

