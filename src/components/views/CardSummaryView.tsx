import React from 'react';
import { Transaction } from '@/types';
import { CreditCard } from 'lucide-react';

interface CardSummaryViewProps {
  transactions: Transaction[];
}

export default function CardSummaryView({ transactions }: CardSummaryViewProps) {
  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Calculate distinct payment methods and their expenses
  const expenses = currentMonthTransactions.filter(t => t.type === 'expense');
  
  const paymentSummary = expenses.reduce((acc, curr) => {
    const method = curr.paymentMethod || '기본';
    if (!acc[method]) acc[method] = 0;
    acc[method] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedSummary = Object.entries(paymentSummary).sort((a, b) => b[1] - a[1]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-socar-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800">결제 수단별 분석</h2>
      </div>

      {sortedSummary.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          이번 달 지출 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSummary.map(([method, amount]) => {
            const percentage = Math.round((amount / totalExpense) * 100) || 0;
            return (
              <div key={method} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{method}</span>
                  <span className="font-bold text-rose-600">{formatCurrency(amount)}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="text-xs text-gray-400 text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
