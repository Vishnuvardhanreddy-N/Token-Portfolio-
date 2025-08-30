import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistItem } from '../../types';

interface WatchlistState {
  items: WatchlistItem[];
}

const WATCHLIST_STORAGE_KEY = 'crypto-portfolio-watchlist';

const loadWatchlistFromLocalStorage = (): WatchlistItem[] => {
  try {
    const serializedWatchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (serializedWatchlist === null) {
      const demo: WatchlistItem[] = [
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: '', holdings: 0.05 },
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: '', holdings: 0.1 },
        { id: 'solana', symbol: 'SOL', name: 'Solana', image: '', holdings: 2.5 },
        { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', image: '', holdings: 2000 },
        { id: 'usd-coin', symbol: 'USDC', name: 'USDC', image: '', holdings: 1000 },
      ];
      saveWatchlistToLocalStorage(demo);
      return demo;
    }
    return JSON.parse(serializedWatchlist);
  } catch (error) {
    console.error("Error loading watchlist from localStorage:", error);
    return [];
  }
};

const saveWatchlistToLocalStorage = (items: WatchlistItem[]) => {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving watchlist to localStorage:", error);
  }
};

const initialState: WatchlistState = {
  items: loadWatchlistFromLocalStorage(),
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<Omit<WatchlistItem, 'holdings' | 'image' | 'name'>>) => {
      if (!state.items.some(item => item.id === action.payload.id)) {
        const newToken = {
          ...action.payload,
          name: '',
          image: '',
          holdings: 0,
        };
        state.items.push(newToken);
        saveWatchlistToLocalStorage(state.items);
      }
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveWatchlistToLocalStorage(state.items);
    },
    updateHoldings: (state, action: PayloadAction<{ id: string; holdings: number }>) => {
      const { id, holdings } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.holdings = holdings;
        saveWatchlistToLocalStorage(state.items);
      }
    },
    updateTokenDetails: (state, action: PayloadAction<{ id: string; name: string; image: string }>) => {
      const { id, name, image } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.name = name;
        existingItem.image = image;
        saveWatchlistToLocalStorage(state.items);
      }
    },
    setWatchlist: (state, action: PayloadAction<WatchlistItem[]>) => {
      state.items = action.payload;
      saveWatchlistToLocalStorage(state.items);
    },
  },
});

export const { addToken, removeToken, updateHoldings, updateTokenDetails, setWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer;