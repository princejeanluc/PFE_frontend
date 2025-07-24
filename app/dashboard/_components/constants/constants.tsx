import { cryptoItem, newsFeedItemType, topCryptoItem } from "../types"

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
    },
    
]

export const newsFeedList : newsFeedItemType[]  = [
    {
        subject : "Réglementation",
        delay : 48*60*1000 ,
        title : "Suspention du bitcoin dans 9 pays",
        cryptosImgRelated : [
            {
                label:"BTC",
                imgUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
            },
            {
                label:"ETH",
                imgUrl: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628"
            }
        ]
    },
    {
        subject : "Cybersécurté",
        delay : 2*60*60*1000 ,
        title : "Attaque massive des serveurs de Tesla",
        cryptosImgRelated : [
            {
                label:"BTC",
                imgUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
            }
        ]
    },
    {
        subject : "Investissement",
        delay : 8*60*1000 ,
        title : "Le projet IcoBoom refait surface avec des avancés majeurs dans la crypto",
        cryptosImgRelated : [
            {
                label:"BTC",
                imgUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
            },
            {
                label:"THT",
                imgUrl: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661"
            }
        ]
    },
    {
        subject : "Réseau",
        delay : 8*60*1000 ,
        title : "Elon musk abondonne le bitcoin , et se tourne vers une nouvelle crypto",
        cryptosImgRelated : [
            {
                label:"BTC",
                imgUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
            },
            {
                label:"THT",
                imgUrl: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661"
            }
        ]
    },
    {
        subject : "Economie",
        delay : 24*60*60*1000 ,
        title : "l'éthiopie adopte le bitcoin comme première monnaie",
        cryptosImgRelated : [
            {
                label:"BTC",
                imgUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
            },
            {
                label:"THT",
                imgUrl: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661"
            }
        ]
    }
]