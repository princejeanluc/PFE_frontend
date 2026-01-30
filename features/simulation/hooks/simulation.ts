import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHoldings,
  createPortfolio,
  deletePortfolio,
  getCryptoMap,
  getCryptoRelations,
  getCryptoReturnsForPortfolio,
  getPortfolio,
  getPortfolios,
  HoldingData,
  PortfolioData,
  simulatePortfolio,
} from "@/features/simulation/api/simulation";
import { toast } from "sonner";

export const useCryptoRelations = (type: string, period: string, lag: number) =>
  useQuery({
    queryKey: ["crypto-relation-data", type, period, lag],
    queryFn: async () => getCryptoRelations(type, period, lag),
    staleTime: 1000 * 60 * 5,
  });

export const useCryptoMap = () =>
  useQuery({
    queryKey: ["crypto-relation-data"],
    queryFn: async () => getCryptoMap(),
    staleTime: 1000 * 60 * 5,
  });

export const useCreatePortfolio = () =>
  useMutation({
    mutationFn: async (data: PortfolioData) => createPortfolio(data),
  });

export const useCreateHoldings = () =>
  useMutation({
    mutationFn: async (data: HoldingData) => createHoldings(data),
  });

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
}) =>
  useQuery({
    queryKey: ["portfolios", page, pageSize, search, start, end],
    queryFn: async () => getPortfolios({ page, pageSize, search, start, end }),
    staleTime: 1000 * 60 * 5,
  });

export const usePortfolio = ({ id }: { id: number }) =>
  useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => getPortfolio({ id }),
    staleTime: 1000 * 60 * 5,
  });

export const useSimulatePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => simulatePortfolio(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["portfolio", id] });
      qc.invalidateQueries({ queryKey: ["portfolio-returns", id] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err?.message || "Échec de la simulation";
      toast.error(msg);
    },
  });
};

export const useCryptoReturnsForPortfolio = (portfolioId: number | string) =>
  useQuery({
    queryKey: ["crypto-returns", portfolioId],
    queryFn: async () => getCryptoReturnsForPortfolio(Number(portfolioId)),
    staleTime: 1000 * 60 * 10,
  });

export const useDeletePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePortfolio(id),
    onSuccess: (_data, id) => {
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
