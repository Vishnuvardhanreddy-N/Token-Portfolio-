// src/components/watchlist/WatchlistTable.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { useGetMarketDataQuery } from '../../store/api/coingeckoApi';
import { updateTokenDetails } from '../../store/slices/watchlistSlice';
import WatchlistRow from './WatchlistRow';
import Pagination from './Pagination';
import AddTokenModal from '../modals/AddTokenModal';
import type { WatchlistTableRowData, PaginationConfig } from '../../types';
import star from "../../../src/assets/star.png";
import cached from "../../../src/assets/cached.png";
import styles from './WatchlistTable.module.css';

const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch();
  const watchlistItems = useSelector((state: RootState) => state.watchlist.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page

  const tokenIds = useMemo(() => watchlistItems.map(item => item.id).join(','), [watchlistItems]);
  const { data: marketData, isLoading, isFetching, isError, refetch } = useGetMarketDataQuery(tokenIds, {
    skip: tokenIds.length === 0,
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  // Reset to page 1 when watchlist items change
  useEffect(() => {
    setCurrentPage(1);
  }, [watchlistItems.length]);

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

  const combinedWatchlistData: WatchlistTableRowData[] = useMemo(() => {
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
    }).filter(item => item.current_price > 0 || item.holdings > 0);
  }, [watchlistItems, marketData]);

  // Frontend pagination (since we're fetching specific tokens by ID)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return combinedWatchlistData.slice(startIndex, endIndex);
  }, [combinedWatchlistData, currentPage, itemsPerPage]);

  const paginationConfig: PaginationConfig = {
    currentPage,
    itemsPerPage,
    totalItems: combinedWatchlistData.length,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <img 
            src={star}
            alt="Watchlist Star" 
            className={styles.starIcon} 
          />
          Watchlist
        </div> 
        <div className={styles.actions}>
          <button
            onClick={() => refetch()}
            className="button button-outline"
            disabled={isFetching}
          >
            <span className={styles.iconWrapper}>
              <img 
                src={cached}
                alt="Refresh Icon" 
                className={styles.refreshIcon} 
              />
            </span>
            <span className={styles.refreshButtonText}>
              {isFetching ? 'Refreshing...' : 'Refresh Prices'}
            </span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="button button-primary" 
            style={{backgroundColor:"#A9E851"}}
          >
            + Add Token
          </button>
        </div>
      </div>

      <div className={`${styles.watchlistTableContainer} bg-card`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Price</th>
                <th>24h %</th>
                <th>Sparkline (7d)</th>
                <th>Holdings</th>
                <th>Value</th>
                <th className={styles.actionsColumn}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && tokenIds.length > 0 && (
                <tr>
                  <td colSpan={7} className={styles.loadingState}>Loading watchlist data...</td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={7} className={styles.errorState}>Error loading watchlist data. Please try again.</td>
                </tr>
              )}
              {!isLoading && !isError && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Your watchlist is empty. Click "+ Add Token" to get started!
                  </td>
                </tr>
              )}
              {!isLoading && !isError && paginatedData.map(token => (
                <WatchlistRow key={token.id} token={token} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Frontend pagination for watchlist items */}
        {combinedWatchlistData.length > itemsPerPage && (
          <Pagination config={paginationConfig} onPageChange={handlePageChange} />
        )}

        <AddTokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default WatchlistTable;