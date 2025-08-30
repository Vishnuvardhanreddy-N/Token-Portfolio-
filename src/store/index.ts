import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './slices/watchlistSlice';
import { coingeckoApi } from './api/coingeckoApi';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    [coingeckoApi.reducerPath]: coingeckoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coingeckoApi.middleware),
});

store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState().watchlist.items);
    localStorage.setItem('watchlist', serializedState);
  } catch (e) {
    console.warn("Could not save watchlist to localStorage", e);
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;