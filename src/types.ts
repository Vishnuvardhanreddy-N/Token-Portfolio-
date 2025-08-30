// src/types.ts

// --- Redux Watchlist Slice Types ---
export interface WatchlistItem {
  id: string; // CoinGecko ID
  symbol: string;
  name: string;
  image: string; // URL to token image
  holdings: number;
}

// --- CoinGecko API Types ---
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: number[]; // Array of prices for the last 7 days
  total_volume: number;
  market_cap: number;
  last_updated: string; // ISO 8601 string
}

export interface TokenSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string; // Small image URL
}

// --- Combined Data for Watchlist Table Row ---
export interface WatchlistTableRowData extends WatchlistItem {
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: number[];
  value: number; // holdings * current_price
  last_updated: string;
}

// --- Chart Data ---
export interface DonutChartData {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

// --- Pagination ---
export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}