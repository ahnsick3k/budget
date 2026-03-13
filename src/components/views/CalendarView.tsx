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
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 overflow-hidden">
      <h2 className="text-xl font-bold mb-6 text-gray-800">이번 달 달력</h2>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center font-medium text-sm text-gray-500 py-2">
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
              className={`min-h-[80px] p-1 sm:p-2 rounded-xl border ${
                isToday(day) ? 'border-socar-400 bg-socar-50/50' : 'border-gray-100 bg-white'
              } ${!isSameMonth(day, currentDate) ? 'opacity-40' : ''}`}
            >
              <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday(day) ? 'text-socar-600' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {income > 0 && <div className="text-[10px] sm:text-xs text-emerald-600 font-semibold truncate">+{formatCurrency(income)}</div>}
                {expense > 0 && <div className="text-[10px] sm:text-xs text-rose-600 font-semibold truncate">-{formatCurrency(expense)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
