
import type { WatchlistTableRowData } from '../types';

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const calculatePortfolioTotal = (data: WatchlistTableRowData[]): number => {
  return data.reduce((sum, item) => sum + (item.value || 0), 0);
};

export const formatTimestamp = (timestamp: string | number | Date): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

export const CHART_COLORS = [
    'var(--chart-color-1)', 
    'var(--chart-color-2)', 
    'var(--chart-color-3)', 
    'var(--chart-color-4)', 
    'var(--chart-color-5)',
    'var(--chart-color-6)', 
];