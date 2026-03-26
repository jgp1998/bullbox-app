import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WorkoutRecord, Theme } from '../types';
import { lbsToKg } from '../utils/formatters';
import { useI18n } from '../context/i18n';

interface ProgressChartProps {
  records: WorkoutRecord[];
  exercise: string;
  theme: Theme;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ records, exercise, theme }) => {
  const { t } = useI18n();
  const filteredRecords = records
    .filter(r => r.exercise === exercise)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  if (filteredRecords.length < 2) {
    return <p className="text-center text-[var(--muted-text)]">{t('workoutHistory.logTwoRecords')}</p>;
  }

  const recordType = filteredRecords[0]?.type;

  const data = filteredRecords.map(r => {
    let value = r.value;
    if (r.type === 'Weight' && r.unit === 'lbs') {
      value = lbsToKg(r.value);
    }
    return {
      date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value,
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
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors['--border']} />
          <XAxis dataKey="date" stroke={theme.colors['--muted-text']} />
          <YAxis stroke={theme.colors['--muted-text']} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: theme.colors['--muted-text'] }} tickFormatter={formatYAxisTick} />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.colors['--card'],
              borderColor: theme.colors['--border'],
              color: theme.colors['--text'],
            }}
            labelStyle={{ color: theme.colors['--primary'] }}
            formatter={(value) => [`${formatYAxisTick(value as number)}`, chartName]}
          />
          <Legend wrapperStyle={{ color: theme.colors['--text'] }} />
          <Line type="monotone" dataKey="value" name={chartName} stroke={theme.colors['--primary']} strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;