import React from 'react';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20">
      <h2 className="text-xl font-bold mb-6 text-gray-800">이번 달 내역</h2>
      
      {currentMonthTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          아직 내역이 없습니다. 첫 내역을 추가해 보세요!
        </div>
      ) : (
        <div className="space-y-4 text-gray-800">
          {currentMonthTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {transaction.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{transaction.category}</span>
                    <span className="text-sm text-gray-500">{transaction.memo}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(transaction.date), 'yyyy년 MM월 dd일', { locale: ko })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-bold text-lg ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
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
