import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { DonutChartData } from '../../types';
import { formatCurrency } from '../../utils';

import styles from './DonutChart.module.css';

interface DonutChartProps {
  data: DonutChartData[];
  totalValue: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipName} style={{ color: item.color }}>{item.name}</p> {/* Uses full name for tooltip */}
        <p className={styles.tooltipValue}>Value: {formatCurrency(item.value)}</p>
        <p className={styles.tooltipPercentage}>Percentage: {item.percentage}</p>
      </div>
    );
  }
  return null;
};

const DonutChart: React.FC<DonutChartProps> = ({ data, totalValue }) => {
  if (!data || data.length === 0 || totalValue === 0) {
    return (
      <div className={styles.noData}>
        No portfolio data yet. Add some tokens and holdings!
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data} // Use data directly
            cx="50%"
            cy="50%"
            innerRadius={45} // Reduced inner radius for a thinner donut
            outerRadius={75} // Reduced outer radius for a smaller chart
            fill="#8884d8"
            paddingAngle={5} // Slightly less padding
            dataKey="value"
            nameKey="name" // Used for tooltip mapping
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;