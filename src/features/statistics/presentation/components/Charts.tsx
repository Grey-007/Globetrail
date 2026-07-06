import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

const COLORS = {
  high: '#FF453A',
  medium: '#FF9F0A',
  low: '#8E8E93',
  visited: '#32D74B',
  planning: '#0A84FF',
  booked: '#BF5AF2',
};

export const PriorityChart = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <div className="h-48 w-full" role="img" aria-label="Priority Distribution Chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => {
              let color = COLORS.low;
              if (entry.name === 'High') color = COLORS.high;
              if (entry.name === 'Medium') color = COLORS.medium;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', borderRadius: '8px', color: 'var(--color-text)' }}
            itemStyle={{ color: 'var(--color-text)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StatusChart = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <div className="h-48 w-full" role="img" aria-label="Status Distribution Chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => {
              let color = COLORS.planning;
              if (entry.name === 'Visited') color = COLORS.visited;
              if (entry.name === 'Booked') color = COLORS.booked;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', borderRadius: '8px', color: 'var(--color-text)' }}
            itemStyle={{ color: 'var(--color-text)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PlacesPerCountryChart = ({ data }: { data: { name: string; count: number }[] }) => {
  if (data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-text-muted text-sm deboss rounded-2xl">No data yet</div>;
  }
  
  return (
    <div className="h-48 w-full" role="img" aria-label="Places per Country Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 12 }} width={80} />
          <Tooltip 
            cursor={{ fill: 'rgba(128,128,128,0.1)' }}
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', borderRadius: '8px', color: 'var(--color-text)' }}
            itemStyle={{ color: 'var(--color-text)' }}
          />
          <Bar dataKey="count" fill="var(--color-gold)" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
