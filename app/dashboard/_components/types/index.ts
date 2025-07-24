export type marketInfo = {
    indicator: string;
    indicatorValue: string | number;
    message:string;
    colorFlag: 1|2|3|4|5
}

export type topCryptoItem ={
    img_url : string;
    label : string ; 
    price : number ; 
    daily_return : number
}

export type cryptoItem = {
    img_url : string;
    label : string ;
    daily_return : number;
    price : number ; 
    trades : number;
    expected_var : -1 | 1 ; 
    expected_profit : number; 

}

export type cryptoIcon = {
    imgUrl : string ;
    label : string ; 
}


export type newsFeedItemType = {
    subject : string;
    delay : number ;
    title : string;
    cryptosImgRelated : cryptoIcon[]; 
}