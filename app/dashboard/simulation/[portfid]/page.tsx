import { ActuAndTopCrypto } from "../../_components/ui/actuandtopcrypto"
import { ChartAreaInteractive } from "../../_components/ui/chartareaInteractive"
import ChartReturns from "../../_components/ui/chartreturns"
import PortfolioComponent from "../../_components/ui/portfoliocomponent"
import PortfolioPieChart from "../../_components/ui/portfoliopiechart"
import ReturnTreeMap from "../../_components/ui/returntreemap"
import RiskIndicators from "../../_components/ui/riskindicators"
import Titlebar from "../../_components/ui/titlebar"
import { usePortfolio } from "../../_lib/hooks/simulation"

export default async function Page({
  params,
}: {
  params: Promise<{ portfid: string }>
}) {
  const { portfid } = await params
  return <PortfolioComponent portfolioId ={portfid}></PortfolioComponent>
}