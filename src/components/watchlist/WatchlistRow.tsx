import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateHoldings, removeToken } from '../../store/slices/watchlistSlice';
import type { WatchlistTableRowData } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import pencil from "../../../src/assets/pencil-square.png";
import trash from "../../../src/assets/trash.png";

import styles from './WatchlistRow.module.css'; 

interface WatchlistRowProps {
  token: WatchlistTableRowData;
}

const WatchlistRow: React.FC<WatchlistRowProps> = ({ token }) => {
  const dispatch = useDispatch();
  const [isEditingHoldings, setIsEditingHoldings] = useState(false);
  const [holdingInput, setHoldingInput] = useState(token.holdings.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingHoldings && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingHoldings]);

  const handleHoldingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoldingInput(e.target.value);
  };

  const saveHoldings = () => {
    const newHoldings = parseFloat(holdingInput);
    if (!isNaN(newHoldings) && newHoldings >= 0) {
      dispatch(updateHoldings({ id: token.id, holdings: newHoldings }));
    } else {
      setHoldingInput(token.holdings.toString()); 
    }
    setIsEditingHoldings(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveHoldings();
    } else if (e.key === 'Escape') {
      setHoldingInput(token.holdings.toString());
      setIsEditingHoldings(false);
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${token.name} from your watchlist?`)) {
      dispatch(removeToken(token.id));
    }
  };

  const priceChangeClass = token.price_change_percentage_24h >= 0 ? 'text-green' : 'text-red';

  return (
    <tr className={styles.row}>
      <td className={styles.tokenCell}>
        <img src={token.image} alt={token.name} className={styles.tokenImage} />
        <div className={styles.tokenInfo}>
          <div className={styles.tokenName}>{token.name} <span style={{color:'#A1A1AA'}}>({token.symbol})</span></div>
        </div>
      </td>
      <td style={{color:'#A1A1AA'}}>{formatCurrency(token.current_price)}</td>
      <td className={priceChangeClass} style={{color:'#A1A1AA'}}>
        {formatPercentage(token.price_change_percentage_24h)}
      </td>
      <td className={styles.sparklineCell}>
        {token.sparkline_in_7d && token.sparkline_in_7d.length > 0 && (
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={token.sparkline_in_7d.map((price, index) => ({ index, price }))}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={token.price_change_percentage_24h >= 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </td>
      <td className={styles.holdingsCell}>
        {isEditingHoldings ? (
          <div className={styles.holdingsEdit}>
            <input
              ref={inputRef}
              type="number"
              step="any"
              value={holdingInput}
              onChange={handleHoldingsChange}
              onBlur={saveHoldings}
              onKeyDown={handleKeyDown}
              className={styles.holdingsInput}
            />
            <button onClick={saveHoldings} className={styles.saveButton}>Save</button>
          </div>
        ) : (
          <span onClick={() => setIsEditingHoldings(true)} className={styles.holdingsValue}>
            {token.holdings.toFixed(4)}
          </span>
        )}
      </td>
      <td>{formatCurrency(token.value)}</td>
      <td className={styles.menuCell}>
        <Menu as="div" className={styles.menuWrapper}>
          <div>
            <Menu.Button className={styles.menuButton} aria-label="Open options">
              ...
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter={styles.menuEnter}
            enterFrom={styles.menuEnterFrom}
            enterTo={styles.menuEnterTo}
            leave={styles.menuLeave}
            leaveFrom={styles.menuLeaveFrom}
            leaveTo={styles.menuLeaveTo}
          >
            <Menu.Items className={styles.menuItems}>
              <div className={styles.menuItemWrapper}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => { setIsEditingHoldings(true); setHoldingInput(token.holdings.toString()); }}
                      className={`${styles.menuItem} ${active ? styles.menuItemActive : ''}`}
                    >
                      <img src={pencil} alt="Edit icon" className={styles.menuIcon} />
                      Edit Holdings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleRemove}
                      className={`${styles.menuItem} ${styles.menuItemDanger} ${active ? styles.menuItemActive : ''}`}
                    >
                      <img src={trash} alt="Remove icon" className={styles.menuIcon} />
                      Remove
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
    </tr>
  );
};

export default WatchlistRow;