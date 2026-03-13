import React from 'react';
import { Transaction } from '@/types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarViewProps {
  transactions: Transaction[];
}

export default function CalendarView({ transactions }: CalendarViewProps) {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Adjust to start on Sunday

  const endDate = new Date(monthEnd);
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // Adjust to end on Saturday
  }

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayTransactions = (date: Date) => {
    return transactions.filter(t => new Date(t.date).toDateString() === date.toDateString());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className="bg-white/70 dark:bg-atl-dark-surface backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 dark:border-white/5 overflow-hidden transition-colors">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-atl-dark-text-strong">이번 달 달력</h2>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center font-medium text-sm text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map(day => {
          const dayTx = getDayTransactions(day);
          const income = dayTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
          const expense = dayTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

          return (
            <div 
              key={day.toISOString()} 
              className={`min-h-[80px] p-1 sm:p-2 rounded-xl border transition-colors ${
                isToday(day) ? 'border-atl-blue-400 dark:border-atl-blue-500 bg-atl-blue-50/50 dark:bg-atl-blue-900/20' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-atl-dark-bg'
              } ${!isSameMonth(day, currentDate) ? 'opacity-40' : ''}`}
            >
              <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday(day) ? 'text-atl-blue-600 dark:text-atl-blue-400' : 'text-gray-700 dark:text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {income > 0 && <div className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate">+{formatCurrency(income)}</div>}
                {expense > 0 && <div className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-semibold truncate">-{formatCurrency(expense)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
