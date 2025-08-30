// src/Home.tsx
import React from 'react';
import PortfolioSummary from './components/portfolio/PortfolioSummary';
import WatchlistTable from './components/watchlist/WatchlistTable';

import styles from './Home.module.css'; // We'll create this CSS

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <PortfolioSummary />
      <WatchlistTable />
    </div>
  );
};

export default Home;