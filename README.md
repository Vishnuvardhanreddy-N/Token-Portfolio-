# Token Portfolio - React + Vite + Redux

A modern cryptocurrency portfolio tracker built with React, TypeScript, and Redux. Track your crypto holdings, view real-time prices, and manage your watchlist with a beautiful, responsive interface.

## 🚀 Live Demo

[View Live Demo](https://your-vercel-link.vercel.app)

## ✨ Features

### 📊 Portfolio Management
- **Real-time Portfolio Total** - Live calculation of total portfolio value
- **Interactive Donut Chart** - Visual representation of asset allocation
- **Last Updated Timestamp** - Shows when data was last refreshed

### 📈 Watchlist Table
- **Token Information** - Logo, name, and symbol for each token
- **Real-time Prices** - Live prices from CoinGecko API
- **24h Percentage Change** - Color-coded (green/red) for easy reading
- **7-day Sparkline Charts** - Visual price trends
- **Editable Holdings** - Click to edit your token amounts
- **Calculated Values** - Automatic value calculation (holdings × price)
- **Row Actions** - Edit holdings or remove tokens

### 🔍 Add Token Modal
- **Search Functionality** - Search tokens using CoinGecko API
- **Trending Section** - Discover popular tokens
- **Multi-selection** - Select multiple tokens at once
- **Add to Watchlist** - Bulk add selected tokens

### 💾 Data Persistence
- **Redux State Management** - Centralized state with Redux Toolkit
- **localStorage Persistence** - Your watchlist and holdings persist across sessions
- **Real-time Sync** - Automatic price updates every 30 seconds

### 🔗 Wallet Integration
- **Wallet Connection** - Connect using wagmi + RainbowKit
- **Address Display** - Shows connected wallet address
- **Connection Status** - Visual indication of wallet connection state

### 📱 Responsive Design
- **Mobile Optimized** - Works seamlessly on all devices
- **Dark Theme** - Modern, eye-friendly interface
- **Smooth Animations** - Polished user experience

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit, RTK Query
- **Styling**: CSS Modules
- **Charts**: Recharts
- **Wallet Integration**: wagmi, RainbowKit
- **API**: CoinGecko API
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/token-portfolio.git
   cd token-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/          # Chart components (DonutChart)
│   ├── layout/          # Layout components (Header)
│   ├── modals/          # Modal components (AddTokenModal)
│   ├── portfolio/       # Portfolio components (PortfolioSummary)
│   ├── wallet/          # Wallet components (ConnectWalletButton)
│   └── watchlist/       # Watchlist components (WatchlistTable, WatchlistRow)
├── hooks/               # Custom hooks (useDebounce)
├── store/               # Redux store configuration
│   ├── api/             # RTK Query API (coingeckoApi)
│   └── slices/          # Redux slices (watchlistSlice)
├── types.ts             # TypeScript type definitions
├── utils/               # Utility functions
└── main.tsx             # Application entry point
```

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality. The app uses public CoinGecko API endpoints.

### Wallet Connection
The app supports multiple wallet connectors:
- MetaMask
- WalletConnect
- Injected wallets

## 📊 API Integration

The app integrates with the CoinGecko API for:
- Real-time cryptocurrency prices
- Token search functionality
- Trending tokens
- 7-day price data for sparklines

## 🎨 Design Features

- **Dark Theme**: Modern, eye-friendly interface
- **Responsive Layout**: Optimized for desktop and mobile
- **Interactive Charts**: Beautiful donut chart with legends
- **Smooth Animations**: Polished user interactions
- **Loading States**: Comprehensive loading and error handling

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Deploy automatically**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Recharts](https://recharts.org/) for beautiful charts
- [wagmi](https://wagmi.sh/) for wallet integration
- [RainbowKit](https://www.rainbowkit.com/) for wallet UI components

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
