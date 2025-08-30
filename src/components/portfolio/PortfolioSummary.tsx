import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { useGetMarketDataQuery } from '../../store/api/coingeckoApi';
import { updateTokenDetails } from '../../store/slices/watchlistSlice';
import DonutChart from '../charts/DonutChart';
import { formatCurrency, formatTimestamp, calculatePortfolioTotal, CHART_COLORS } from '../../utils';
import type { DonutChartData, WatchlistTableRowData } from '../../types';

import styles from './PortfolioSummary.module.css';

const PortfolioSummary: React.FC = () => {
  const dispatch = useDispatch();
  const watchlistItems = useSelector((state: RootState) => state.watchlist.items);

  const tokenIds = useMemo(() => watchlistItems.map(item => item.id).join(','), [watchlistItems]);
  const { data: marketData, isLoading, isError } = useGetMarketDataQuery(tokenIds, {
    skip: tokenIds.length === 0,
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  // Update token details (name, image) in Redux once market data is available
  useEffect(() => {
    if (marketData && marketData.length > 0) {
      marketData.forEach(apiItem => {
        const watchlistItem = watchlistItems.find(item => item.id === apiItem.id);
        if (watchlistItem && (watchlistItem.name !== apiItem.name || watchlistItem.image !== apiItem.image)) {
          dispatch(updateTokenDetails({ id: apiItem.id, name: apiItem.name, image: apiItem.image }));
        }
      });
    }
  }, [marketData, watchlistItems, dispatch]);

  const combinedPortfolioData: WatchlistTableRowData[] = useMemo(() => {
    if (!marketData || marketData.length === 0) return [];

    return watchlistItems.map(watchlistItem => {
      const apiData = marketData.find(m => m.id === watchlistItem.id);
      if (apiData) {
        const value = watchlistItem.holdings * apiData.current_price;
        return {
          ...watchlistItem,
          ...apiData,
          value: value,
        };
      }
      // If API data isn't found, use placeholder values
      return {
        ...watchlistItem,
        current_price: 0,
        price_change_percentage_24h: 0,
        sparkline_in_7d: [],
        total_volume: 0,
        market_cap: 0,
        last_updated: '',
        value: 0,
      };
    });
  }, [watchlistItems, marketData]);

  const portfolioTotal = useMemo(() => calculatePortfolioTotal(combinedPortfolioData), [combinedPortfolioData]);

  const chartData: DonutChartData[] = useMemo(() => {
    if (portfolioTotal === 0 || combinedPortfolioData.length === 0) return [];

    // Sort by value for consistent coloring/ordering
    const sortedData = [...combinedPortfolioData].sort((a, b) => b.value - a.value);

    // Display all items individually, as per the screenshot's legend
    return sortedData.map((item, index) => ({
      name: `${item.name} (${item.symbol.toUpperCase()})`, // Full name for legend and tooltip
      value: item.value,
      percentage: ((item.value / portfolioTotal) * 100).toFixed(2) + '%',
      color: CHART_COLORS[index % CHART_COLORS.length],
      symbol: item.symbol.toUpperCase(), // Symbol for legend (used here as a fallback identifier)
    }));
  }, [combinedPortfolioData, portfolioTotal]);

  const lastUpdatedTimestamp = marketData && marketData.length > 0
    ? formatTimestamp(new Date(marketData[0].last_updated)) // Assuming all market data updates around the same time
    : 'N/A';

  // Handling loading and error states
  if (isLoading && watchlistItems.length > 0) {
    return (
      <div className={`${styles.portfolioSummary} bg-card`}>
        <div className={styles.loadingMessage}>Loading portfolio data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${styles.portfolioSummary} bg-card`}>
        <div className={styles.errorMessage}>Error loading portfolio data.</div>
      </div>
    );
  }

  // If no items in watchlist or market data, display empty state
  if (watchlistItems.length === 0 || portfolioTotal === 0) {
    return (
      <div className={`${styles.portfolioSummary} bg-card`}>
        <div className={styles.emptyMessage}>No assets in your portfolio. Add some tokens to get started!</div>
      </div>
    );
  }

  return (
    <div className={`${styles.portfolioSummary} bg-card`}>
      {/* Left Column: Portfolio Total Value & Last Updated */}
      <div className={styles.portfolioInfoColumn}>
        <div className={styles.portfolioInfoTop}> {/* NEW: Group for top elements */}
          <div className={styles.sectionTitle}>Portfolio Total</div>
          <div className={styles.totalValue}>{formatCurrency(portfolioTotal)}</div>
        </div>
        <div className={styles.lastUpdated}>Last updated: {lastUpdatedTimestamp}</div>
      </div>
      
      {/* Right Column: Chart and Legend */}
      <div className={styles.chartAndLegendColumn}>
        <div className={styles.sectionTitle}>Portfolio Total</div> {/* Title for the chart section */}
        <div className={styles.chartContainer}>
          <div className={styles.chartSection}>
            <DonutChart data={chartData} totalValue={portfolioTotal} />
          </div>
          <div className={styles.legendSection}>
            <ul className={styles.legendList}>
              {chartData.map((entry, index) => (
                <li key={index} className={styles.legendItem}> 
                  <span className={styles.legendText} style={{ color: entry.color }}>{entry.name}</span>
                  <span className={styles.legendPercentage} style={{ color: entry.color }}>{entry.percentage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;