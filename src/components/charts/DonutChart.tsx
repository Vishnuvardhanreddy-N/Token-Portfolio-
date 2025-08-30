import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { DonutChartData } from '../../types';
import styles from './DonutChart.module.css';

interface DonutChartProps {
  data: DonutChartData[];
  totalValue: number;
}

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
            data={data} 
            cx="50%"
            cy="50%"
            innerRadius={45} 
            outerRadius={75} 
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
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