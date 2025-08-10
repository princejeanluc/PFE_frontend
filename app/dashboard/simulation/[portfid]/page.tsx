
import PortfolioComponent from "../../_components/ui/portfoliocomponent"

export default async function Page({
  params,
}: {
  params: Promise<{ portfid: string }>
}) {
  const { portfid } = await params
  return <PortfolioComponent portfolioId ={portfid}></PortfolioComponent>
}