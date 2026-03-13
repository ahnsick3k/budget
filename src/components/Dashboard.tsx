import React from 'react';
import { Transaction } from '@/types';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const income = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Balance Card */}
      <div className="bg-white/70 dark:bg-atl-dark-surface backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 dark:border-white/5 transition-colors">
        <div className="flex items-center gap-3 mb-2 text-gray-600 dark:text-atl-dark-text">
          <Wallet className="w-5 h-5 text-atl-blue-500 dark:text-atl-blue-400" />
          <h3 className="font-medium text-sm">이번 달 잔액</h3>
        </div>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-900 dark:text-atl-dark-text-strong' : 'text-red-500 dark:text-red-400'}`}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Income Card */}
      <div className="bg-white/70 dark:bg-atl-dark-surface backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 dark:border-white/5 transition-colors">
        <div className="flex items-center gap-3 mb-2 text-gray-600 dark:text-atl-dark-text">
          <ArrowUpCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <h3 className="font-medium text-sm">이번 달 수입</h3>
        </div>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(income)}
        </p>
      </div>

      {/* Expense Card */}
      <div className="bg-white/70 dark:bg-atl-dark-surface backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 dark:border-white/5 transition-colors">
        <div className="flex items-center gap-3 mb-2 text-gray-600 dark:text-atl-dark-text">
          <ArrowDownCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          <h3 className="font-medium text-sm">이번 달 지출</h3>
        </div>
        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
          {formatCurrency(expense)}
        </p>
      </div>
    </div>
  );
}
