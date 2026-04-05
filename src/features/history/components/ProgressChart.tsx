import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoryRecord } from '@/shared/types';
import { Theme } from '@/shared/types';
import { lbsToKg, formatDate } from '@/shared/utils/formatters';
import { useI18n } from '@/shared/context/i18n';

interface ProgressChartProps {
  records: HistoryRecord[];
  exercise: string;
  theme: Theme;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ records, exercise, theme }) => {
  const { t } = useI18n();
  const filteredRecords = records
    .filter(r => r.exercise === exercise)
    .sort((a, b) => {
      const dateA = a.date.split('-').map(Number);
      const dateB = b.date.split('-').map(Number);
      // If we have YYYY-MM-DD
      if (dateA.length === 3 && dateB.length === 3) {
        const timeA = new Date(dateA[0], dateA[1] - 1, dateA[2]).getTime();
        const timeB = new Date(dateB[0], dateB[1] - 1, dateB[2]).getTime();
        return timeA - timeB;
      }
      // Fallback for other formats
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
  if (filteredRecords.length < 2) {
    return (
        <div className="flex items-center justify-center h-[300px] bg-[var(--card)] rounded-lg border border-dashed border-[var(--border)]">
            <p className="text-center text-[var(--muted-text)] font-medium">
                {t('workoutHistory.logTwoRecords')}
            </p>
        </div>
    );
  }

  // Determine chart type based on record data
  const hasWeight = filteredRecords.some(r => r.weight !== undefined && r.weight !== null && r.weight > 0);
  const hasTime = filteredRecords.some(r => r.time !== undefined && r.time !== null && r.time > 0 && !r.weight);
  
  const recordType = hasWeight ? 'Weight' : (hasTime ? 'Time' : 'Reps');

  const data = filteredRecords.map(r => {
    let value: number;
    if (recordType === 'Weight') {
      value = r.weight || 0;
      if (r.unit === 'lbs') value = lbsToKg(value);
    } else if (recordType === 'Time') {
      value = r.time || 0;
    } else {
      value = r.reps || 0;
    }
    
    return {
      date: formatDate(r.date, { month: 'short', day: 'numeric' }),
      value: value as number,
    };
  });
  
  const yAxisLabel = recordType === 'Time' ? 'Seconds' : (recordType === 'Weight' ? 'Kg' : 'Reps');
  const chartName = recordType === 'Weight' ? 'Weight (kg)' : recordType;

  const formatYAxisTick = (tick: number) => {
    if (recordType === 'Time') {
      const minutes = Math.floor(tick / 60);
      const seconds = tick % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return tick.toFixed(1);
  };

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors['--border']} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={theme.colors['--muted-text']} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={theme.colors['--muted-text']} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxisTick} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.colors['--card'],
              borderColor: theme.colors['--border'],
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: theme.colors['--text'],
            }}
            itemStyle={{ color: theme.colors['--primary'], fontWeight: 'bold' }}
            labelStyle={{ color: theme.colors['--muted-text'], marginBottom: '4px' }}
            formatter={(value) => [`${formatYAxisTick(value as number)}`, chartName]}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            name={chartName} 
            stroke={theme.colors['--primary']} 
            strokeWidth={3} 
            dot={{ r: 4, fill: theme.colors['--primary'], strokeWidth: 2, stroke: theme.colors['--card'] }}
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
