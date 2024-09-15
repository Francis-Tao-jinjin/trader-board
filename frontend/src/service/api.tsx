import { StockDailyDataShape, StockEMAShape, StockMACDShape, StockOverViewShape, StockSMAShape } from "./interface";

const baseURL = 'http://127.0.0.1:5000/api';

const fetcher = async(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // allow set cookie even in CORS
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(response.statusText);
    (error as any).response = data;
    throw error;
  }
  return data;
}

export const getUserInfo = async () => {
  return fetcher(`${baseURL}/auth/user`);
}

export const login = async ({username, password}: {username: string, password: string}) => {
  return fetcher(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
}

export const logout = async () => {
  return fetcher(`${baseURL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const register = async ({username, password}: {username: string, password: string}) => {
  return fetcher(`${baseURL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
}

export const getUserStockList = async () => {
  return fetcher(`${baseURL}/stock/user/list`) as Promise<{
    data: StockOverViewShape[];
  }>;
}

export const addStock = async ({ symbol }: { symbol: string }) => {
  return fetcher(`${baseURL}/stock/add_stock/${symbol}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const getStockDailyRecord = async ({ symbol }: { symbol: string }) => {
  return fetcher(`${baseURL}/stock/daily/${symbol}`) as Promise<{
    data: {
      symbol: string;
      daily_record: StockDailyDataShape[];
    }
  }>;
}

export const getStockSMA = async ({ symbol, window = 20 }: { symbol: string, window?: number }) => {
  return fetcher(`${baseURL}/stock/${symbol}/sma?window=${window}`) as Promise<{
    data: StockSMAShape[];
  }>;
};

export const getStockEMA = async ({ symbol, window = 20 }: { symbol: string, window?: number }) => {
  return fetcher(`${baseURL}/stock/${symbol}/ema?window=${window}`) as Promise<{
    data: StockEMAShape[];
  }>;
};

export const getStockMACD = async ({ symbol }: { symbol: string }) => {
  return fetcher(`${baseURL}/stock/${symbol}/macd`) as Promise<{
    data: StockMACDShape[];
  }>;
};