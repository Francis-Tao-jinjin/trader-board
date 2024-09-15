export type StockDailyDataShape = {
  date: string, //'2021-01-01'
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}

export type StockOverViewShape = {
  symbol: string,
  name: string,
  exchange: string,
  industry: string,
  website: string,
  description: string,
  sector: string,
  eps: number,
  market_capitalization: number
  fiftytwo_week_high: number,
  fiftytwo_week_low: number,
}

export type StockSMAShape = {
  SMA: number,
  close: number,
  date: string, // "Tue, 23 Apr 2024 00:00:00 GMT"
}

export type StockEMAShape = {
  EMA: number,
  close: number,
  date: string, // "Tue, 23 Apr 2024 00:00:00 GMT"
}

export type StockMACDShape = {
  '12_EMA': number,
  '26_EMA': number,
  close: number,
  MACD: number,
  Signal: number,
  Histogram: number,
  date: string, // "Tue, 23 Apr 2024 00:00:00 GMT"
}