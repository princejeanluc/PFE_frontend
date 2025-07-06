import { cryptoItem, topCryptoItem } from "../types"

export const flagscolors = ["oklch(57.7% 0.245 27.325)", "oklch(64.6% 0.222 41.116)","oklch(66.6% 0.179 58.318)","oklch(68.1% 0.162 75.834)","oklch(84.1% 0.238 128.85)"]
export const listTopCrypto: topCryptoItem[] = [
    {
        img_url:"https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        label : "Bitcoin" , 
        price : 107908 , 
        daily_return : 0.02,
    },
    {
        img_url:"https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
        label : "Ethereum" , 
        price : 2507 , 
        daily_return : -0.2,
    },
    {
        img_url:"https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
        label : "Tether" , 
        price : 1 , 
        daily_return : 0.0,
    },
]


export const listCrypto : cryptoItem[] = [
    {
        img_url:"https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        label : "Bitcoin" , 
        price : 107908 , 
        daily_return : 0.02,
        trades : 4205,
        expected_var : 1  , 
        expected_profit : 50.5
    },
    {
        img_url:"https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
        label : "Ethereum" , 
        price : 10379 , 
        daily_return : 0.02,
        trades : 4205,
        expected_var : -1  , 
        expected_profit : 45.5
    },
    {
        img_url:"https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
        label : "Tether" , 
        price : 508 , 
        daily_return : 0.02,
        trades : 4205,
        expected_var : 1  , 
        expected_profit : 45.2
    }
]