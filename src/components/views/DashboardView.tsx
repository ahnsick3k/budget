import React from 'react';
import { Transaction } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardViewProps {
  transactions: Transaction[];
}

const COLORS = ['#00B8FF', '#0093cc', '#006e99', '#33c9ff', '#66d6ff', '#99e4ff', '#004a66'];

export default function DashboardView({ transactions }: DashboardViewProps) {
  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const expenses = currentMonthTransactions.filter(t => t.type === 'expense');

  const categorySummary = expenses.reduce((acc, curr) => {
    const cat = curr.category;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categorySummary).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  return (
    <div className="bg-white/70 dark:bg-atl-dark-surface backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 dark:border-white/5 h-[450px] flex flex-col transition-colors">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-atl-dark-text-strong">카테고리별 지출 통계</h2>
      
      {pieData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-atl-dark-text">
          이번 달 지출 내역이 없습니다.
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any /* eslint-disable-line */) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
