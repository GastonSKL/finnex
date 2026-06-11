export interface Asset {
    ticker: string;
    name: string;
    price: string;
    changePercent: number;
    category: 'STOCK'| 'CRYPTO' | 'FIAT';
};

export type Transaction = 
| {
 id: string;
 type: 'BUY' | 'SELL';
 ticker: string;
 shares: number;
 pricePerShare: number;
 timestamp: number;
}
| {
 id: string;
 type: 'DEPOSIT' | 'WITHDRAWAL';
 amount: number;
 currency: string;
 timestamp: number;
};

export type AssetPriceAlert = Pick<Asset, 'ticker'> & Partial<Pick<Asset,'price'>>;