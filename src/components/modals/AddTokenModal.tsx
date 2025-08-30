// src/components/modals/AddTokenModal.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { addToken } from '../../store/slices/watchlistSlice';
import useDebounce from '../../hooks/useDebounce';
import { useSearchTokensQuery, useGetTrendingTokensQuery } from '../../store/api/coingeckoApi';
import type { TokenSearchResult } from '../../types';
import circle from "../../../src/assets/check_circle.png";
import star from "../../../src/assets/star.png";
import styles from './AddTokenModal.module.css'; 

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<TokenSearchResult[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: searchResults, isLoading: isSearching, isError: searchError } = useSearchTokensQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });

  const { data: trendingTokens, isLoading: isLoadingTrending, isError: trendingError } = useGetTrendingTokensQuery(undefined, {
    skip: !!debouncedSearchTerm, 
  });

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedTokens([]);
    }
  }, [isOpen]);

  const handleSelectToken = (token: TokenSearchResult) => {
    setSelectedTokens(prev =>
      prev.some(t => t.id === token.id)
        ? prev.filter(t => t.id !== token.id)
        : [...prev, token]
    );
  };

  const handleAddSelectedTokens = () => {
    selectedTokens.forEach(token => {
      dispatch(addToken({ id: token.id, symbol: token.symbol }));
    });
    onClose();
  };

  const currentList = searchTerm ? searchResults : trendingTokens;
  const isLoading = searchTerm ? isSearching : isLoadingTrending;
  const isError = searchTerm ? searchError : trendingError;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className={styles.dialog} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter={styles.transitionEnter}
          enterFrom={styles.transitionEnterFrom}
          enterTo={styles.transitionEnterTo}
          leave={styles.transitionLeave}
          leaveFrom={styles.transitionLeaveFrom}
          leaveTo={styles.transitionLeaveTo}
        >
          <div className={styles.overlay} />
        </Transition.Child>

        <div className={styles.panelWrapper}>
          <div className={styles.panelContainer}>
            <Transition.Child
              as={Fragment}
              enter={styles.transitionEnter}
              enterFrom={styles.transitionEnterFrom}
              enterTo={styles.transitionEnterTo}
              leave={styles.transitionLeave}
              leaveFrom={styles.transitionLeaveFrom}
              leaveTo={styles.transitionLeaveTo}
            >
              <Dialog.Panel className={`${styles.dialogPanel} bg-card`}>
                
                <div className={styles.body}>
                  <input
                    type="text"
                    placeholder="Search tokens (e.g., ETH, SOL...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`input-field ${styles.searchInput}`}
                  />

                  <div className={styles.listContainer}>
                    {isLoading && <div className={styles.statusMessage}>Loading...</div>}
                    {isError && <div className={`${styles.statusMessage} ${styles.errorMessage}`}>Error fetching tokens.</div>}
                    {!isLoading && !isError && currentList && currentList.length === 0 && (
                      <div className={styles.statusMessage}>No tokens found.</div>
                    )}
                    {!isLoading && !isError && currentList && currentList.length > 0 && (
                      <div className={styles.tokenList}>
                        {searchTerm === '' && <p className={styles.listSectionTitle}>Trending</p>}
                        {currentList.map(token => (
                          <div
                            key={token.id}
                            className={`${styles.tokenItem} ${selectedTokens.some(t => t.id === token.id) ? styles.tokenItemSelected : ''}`}
                            onClick={() => handleSelectToken(token)}
                          >
                            <img src={token.thumb} alt={token.name} className={styles.tokenImage} />
                            <div className={styles.tokenInfo}>
                              <div className={styles.tokenName}>{token.name}</div>
                              <div className={styles.tokenSymbol}>{token.symbol}</div>
                            </div>
                            <div className={styles.selectionIndicator}>
                              {selectedTokens.some(t => t.id === token.id) ? (
                                <div className={styles.selectedState}>
                                  <img src={star} alt="Favorite star" className={styles.starIcon} />
                                   <img src={circle} alt="Selected checkmark" className={styles.checkmarkIcon} />
                                </div>
                              ) : (
                                <div className={styles.radioCircle} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.footer}>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={handleAddSelectedTokens}
                    disabled={selectedTokens.length === 0}  style={{backgroundColor:"#A9E851",color:'black'}}
                  >
                    Add to Watchlist
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTokenModal;