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
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-2 text-gray-600">
          <Wallet className="w-5 h-5 text-socar-500" />
          <h3 className="font-medium text-sm">이번 달 잔액</h3>
        </div>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Income Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-2 text-gray-600">
          <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="font-medium text-sm">이번 달 수입</h3>
        </div>
        <p className="text-3xl font-bold text-emerald-600">
          {formatCurrency(income)}
        </p>
      </div>

      {/* Expense Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-2 text-gray-600">
          <ArrowDownCircle className="w-5 h-5 text-rose-500" />
          <h3 className="font-medium text-sm">이번 달 지출</h3>
        </div>
        <p className="text-3xl font-bold text-rose-600">
          {formatCurrency(expense)}
        </p>
      </div>
    </div>
  );
}
