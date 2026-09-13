import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const salesData = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 5800 },
  { day: 'Wed', revenue: 6900 },
  { day: 'Thu', revenue: 8400 },
  { day: 'Fri', revenue: 11200 },
  { day: 'Sat', revenue: 14500 },
  { day: 'Sun', revenue: 9800 },
];

export const SalesAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Deep-dive intelligence into revenue trends and product velocity.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4">Daily Sales Revenue ($)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334E68" opacity={0.15} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
