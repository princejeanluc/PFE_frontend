// dashboard/_lib/api/simulation.ts

import {api} from './index'



export const  getCryptoRelations= async (type: string, period: string, lag: number)=>{
     try{
        const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crypto-relations/`, {
        params: { type, period, lag },})
        return response.data
     }
     catch(error){
        throw new Error(`Erreur lors du chargement des données du graphique crypto-relations ${error}`);
     }
}


export const  getCryptoMap= async ()=>{
     try{
        const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crypto-map/`)
        return response.data
     }
     catch(error){
        throw new Error(`Erreur lors du chargement des données du graphique crypto-relations ${error}`);
     }
}


export interface PortfolioData {
  name: string
  holding_start: string
  holding_end: string
  initial_budget: number
  allocation_type: 'manual' | 'static_opt' | 'dynamic_opt',
  objective:any
}

export interface HoldingData {
  portfolio: number
  crypto: string
  allocation_percentage: number
}

export const createPortfolio = async (data: PortfolioData) => {
  try {
    const response = await api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/`, data)
    return response.data
  } catch (error) {
    throw new Error(`Erreur lors de la création du portefeuille ${error}`)
  }
}

export const createHoldings = async (data: HoldingData) => {
  try {
    const response = await api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/holdings/`, data)
    return response.data
  } catch (error) {
    throw new Error( `Erreur lors de l'enregistrement des allocations ${error}`)
  }
}


export const getPortfolios = async ({
  page = 1,
  pageSize = 10,
  search = "",
  start = "",
  end = "",
}: { page?: number; pageSize?: number; search?: string ; start?: string ; end? : string}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      start: start.toString(),
      end : end.toString()
    });
    if (search) params.append("search", search);

    const response = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error( `Erreur lors du chargement des portfolios de l'utilisateur ${error}`);
  }
};

export const  getPortfolio= async ({id}:{id: number})=>{
     try{
        const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/${id}`)
        return response.data
     }
     catch(error){
        throw new Error( `Erreur lors du chargement des données du graphique crypto-relations ${error}`);
     }
}

export const simulatePortfolio = async (id: number) => {
  
    const response = await api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/${id}/simulate/`)
    return response.data
}

export const getCryptoReturnsForPortfolio = async (id: number) => {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/${id}/crypto-returns/`);
    return response.data;
  } catch (error) {
    throw new Error( `Erreur lors du chargement des rendements des cryptos du portefeuille ${error}`);
  }
};

export const deletePortfolio = async (id: number) => {
  try {
    const res = await api.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/portfolios/${id}/`
    );
    return res.data;
  } catch (error: any) {
    // remonte un message propre (DRF: {detail: "..."} ou {error: "..."} ou 403/404)
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.detail ||
      "Échec de la suppression du portefeuille";
    throw new Error(msg);
  }
};


