import React from 'react';
import { 
    Radar, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    ResponsiveContainer 
} from 'recharts';

interface BalanceChartProps {
    data: Record<string, number>;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
    const chartData = [
        { subject: 'Push', value: data.push || 0, fullMark: 100 },
        { subject: 'Pull', value: data.pull || 0, fullMark: 100 },
        { subject: 'Squat', value: data.squat || 0, fullMark: 100 },
        { subject: 'Hinge', value: data.hinge || 0, fullMark: 100 },
        { subject: 'Cardio', value: data.cardio || 0, fullMark: 100 },
    ];

    // Find max value to scale properly
    const maxVal = Math.max(...chartData.map(d => d.value), 1);
    const normalizedData = chartData.map(d => ({
        ...d,
        value: (d.value / maxVal) * 100
    }));

    return (
        <div className="w-full h-64 bg-(--card) border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
            <h4 className="text-xs font-bold text-(--muted-text) uppercase tracking-widest mb-2">Balance de Movimiento</h4>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: 'var(--muted-text)', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <Radar
                        name="Athlete"
                        dataKey="value"
                        stroke="var(--primary)"
                        fill="var(--primary)"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BalanceChart;
