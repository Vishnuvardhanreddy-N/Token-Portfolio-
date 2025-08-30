// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Your global styles

// Redux
import { Provider } from 'react-redux';
import { store } from './store';

// Wagmi (Wallet Connect)
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './wagmiConfig.ts';

// Tanstack Query (used by Wagmi, and can be used directly if needed)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);