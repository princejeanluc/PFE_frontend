import React from "react";
import CryptoMiniCard from "./cryptominicard";
import { useCryptoReturnsForPortfolio } from "../../_lib/hooks/simulation";

const CryptoMiniList = ({ portfolioId }: { portfolioId: number }) => {
  const { data, isLoading, error } = useCryptoReturnsForPortfolio(portfolioId);

  if (isLoading) return <div>Chargement...</div>;
  if (error || !data) return <div>Erreur lors du chargement.</div>;

  return (
    <div className="overflow-x-auto flex gap-4 p-2">
      {data.map((crypto: any) => (
        <CryptoMiniCard key={crypto.symbol} symbol={crypto.symbol} data={crypto.returns} />
      ))}
    </div>
  );
};

export default CryptoMiniList;