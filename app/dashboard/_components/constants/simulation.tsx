export const cryptoRelationData0 = [
  { x: 'BTC', y: 'BTC', value: 1.00 },
  { x: 'BTC', y: 'BNB', value: 0.17 },
  { x: 'BNB', y: 'BNB', value: 1.00 },
  { x: 'SOL', y: 'BTC', value: 0.17 },
  // etc.
]


export const tickers = ['BTC', 'BNB', 'SOL', 'CRO', 'CELO', 'ADA', 'USDT', 'ETH', 'HNT', 'XRP', 'DOT', 'MATIC', 'DAI', 'TRX']

export const cryptoRelationData = tickers.map((row, i) => {
  const rowData: Record<string, number | string> = { id: row }
  tickers.forEach((col, j) => {
    // Triangle inférieur : on ne garde que les cases sous la diagonale
    rowData[col] = j > i ? NaN : i === j ? 1.0 : 0.17
  })
  return rowData
})




export const cryptoScatterData = [
  { id: "BTC", x: 30, y: 70,cluster:0, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 12.4, volatility: 18.6 },
  { id: "ETH", x: -52, y: 65,cluster:1, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 9.3, volatility: 22.1 },
  { id: "BNB", x: 60, y: 75,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 7.8, volatility: 15.2 },
  { id: "SOL", x: -28, y: 58,cluster:0, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 14.7, volatility: 27.3 },
  { id: "ADA", x: 22, y: 80,cluster:1, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 5.1, volatility: 19.4 },
  { id: "XRP", x: 35, y: 40,cluster:2, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 3.9, volatility: 11.6 },
  { id: "DOT", x: 40, y: 20,cluster:0, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 6.7, volatility: 17.2 },
  { id: "AVAX", x: 5, y: 32,cluster:3, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 8.9, volatility: 21.7 },
  { id: "MATIC", x: 28, y: 25,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 4.5, volatility: 13.3 },
  { id: "TRX", x: 70, y: -65,cluster:4, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 2.6, volatility: 10.9 },
  { id: "LTC", x: 67, y: 48,cluster:2, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 3.2, volatility: 12.2 },
  { id: "ATOM", x: -50, y: 60,cluster:4, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 4.7, volatility: 14.5 },
  { id: "LINK", x: 20, y: 30,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 5.6, volatility: 16.9 },
  { id: "NEAR", x: 55, y: 78,cluster:2, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 7.1, volatility: 23.2 },
  { id: "XTZ", x: 18, y: -60,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 1.9, volatility: 9.8 },
  { id: "EGLD", x: 48, y: 46,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 6.0, volatility: 18.1 },
  { id: "ALGO", x: 63, y: 28,cluster:1, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 2.4, volatility: 13.7 },
  { id: "AAVE", x: 75, y: -34,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 10.2, volatility: 25.6 },
  { id: "UNI", x: -33, y: 50, cluster:2,logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 6.8, volatility: 20.3 },
  { id: "USDT", x: 10, y: 10, cluster:0,logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 0.0, volatility: 0.5 },
]