import React from 'react';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const { language } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="bg-white/70 dark:bg-atl-dark-surface backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 dark:border-white/5 transition-colors">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-atl-dark-text-strong">
        {language === 'kr' ? '이번 달 내역' : "This Month's Transactions"}
      </h2>
      
      {currentMonthTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-atl-dark-text">
          {language === 'kr' ? '아직 내역이 없습니다. 첫 내역을 추가해 보세요!' : 'No transactions yet. Add your first one!'}
        </div>
      ) : (
        <div className="space-y-4 text-gray-800 dark:text-atl-dark-text">
          {currentMonthTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-atl-dark-bg shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                }`}>
                  {transaction.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-atl-dark-text-strong">{transaction.category}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{transaction.memo}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {format(new Date(transaction.date), language === 'kr' ? 'yyyy년 MM월 dd일' : 'MMM dd, yyyy', { locale: language === 'kr' ? ko : enUS })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-bold text-lg ${
                  transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                
                <button 
                  onClick={() => onDelete(transaction.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
