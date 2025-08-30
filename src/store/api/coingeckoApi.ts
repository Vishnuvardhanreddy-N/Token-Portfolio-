import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CoinMarketData, TokenSearchResult } from '../../types';


export const coingeckoApi = createApi({
  reducerPath: 'coingeckoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3/' }),
  endpoints: (builder) => ({
    getMarketData: builder.query<CoinMarketData[], string>({
      query: (ids) =>
        `coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h`,
      transformResponse: (response: any[]): CoinMarketData[] =>
        response.map((item) => ({
          id: item.id,
          symbol: item.symbol?.toUpperCase() || '',
          name: item.name,
          image: item.image,
          current_price: item.current_price,
          price_change_percentage_24h: item.price_change_percentage_24h,
          sparkline_in_7d: item.sparkline_in_7d?.price || [],
          total_volume: item.total_volume,
          market_cap: item.market_cap,
          last_updated: item.last_updated,
        })),
    }),
    searchTokens: builder.query<TokenSearchResult[], string>({
      query: (query) => `search?query=${query}`,
      transformResponse: (response: any): TokenSearchResult[] =>
        response.coins.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol?.toUpperCase() || '',
          thumb: coin.thumb,
        })),
    }),
    getTrendingTokens: builder.query<TokenSearchResult[], void>({
      query: () => `search/trending`,
      transformResponse: (response: any): TokenSearchResult[] =>
        response.coins.map((coin: any) => ({
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol?.toUpperCase() || '',
          thumb: coin.item.thumb,
        })),
    }),
  }),
});

export const { useGetMarketDataQuery, useSearchTokensQuery, useGetTrendingTokensQuery } = coingeckoApi;