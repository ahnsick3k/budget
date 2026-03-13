import React, { useState } from 'react';
import { Transaction } from '@/types';
import { PlusCircle } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIES = {
  income: ['급여', '용돈', '이자', '상여금', '기타'],
  expense: ['식비', '교통비', '통신비', '문화/생활', '주거', '건강', '쇼핑', '기타'],
};

export default function TransactionForm({ onAdd, isLoading }: TransactionFormProps) {
  const { language } = useTheme();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [paymentMethod, setPaymentMethod] = useState('신용카드');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  // Update category when type changes
  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    await onAdd({
      type,
      date,
      category,
      paymentMethod,
      amount: Number(amount),
      memo,
    });

    setAmount('');
    setMemo('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-atl-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-atl-blue-700 hover:shadow-xl hover:scale-105 transition-all text-gray-800"
        title={language === 'kr' ? '내역 추가' : 'Add Transaction'}
      >
        <PlusCircle size={32} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-800 dark:text-atl-dark-text-strong">
      <div className="bg-white dark:bg-atl-dark-surface rounded-3xl p-6 w-full max-w-md shadow-2xl relative border border-transparent dark:border-white/10 transition-colors">
        <h2 className="text-2xl font-bold mb-6">
          {language === 'kr' ? '새 내역 추가' : 'Add Transaction'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-atl-dark-bg p-1 rounded-xl transition-colors">
             <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'expense' ? 'bg-white dark:bg-atl-dark-surface shadow-sm text-gray-900 dark:text-atl-dark-text-strong' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTypeChange('expense')}
            >
              {language === 'kr' ? '지출' : 'Expense'}
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'income' ? 'bg-white dark:bg-atl-dark-surface shadow-sm text-gray-900 dark:text-atl-dark-text-strong' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTypeChange('income')}
            >
              {language === 'kr' ? '수입' : 'Income'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-atl-dark-text mb-1">
              {language === 'kr' ? '날짜' : 'Date'}
            </label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-atl-dark-border rounded-xl px-4 py-2 bg-white dark:bg-atl-dark-surface text-gray-900 dark:text-atl-dark-text-strong focus:ring-2 focus:ring-atl-blue-500 focus:border-atl-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-atl-dark-text mb-1">
              {language === 'kr' ? '카테고리' : 'Category'}
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-atl-dark-border rounded-xl px-4 py-2 bg-white dark:bg-atl-dark-surface text-gray-900 dark:text-atl-dark-text-strong focus:ring-2 focus:ring-atl-blue-500 focus:border-atl-blue-500 outline-none transition-colors"
            >
              {CATEGORIES[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-atl-dark-text mb-1">
              {language === 'kr' ? '결제수단' : 'Payment Method'}
            </label>
            <input 
              type="text" 
              required
              placeholder={language === 'kr' ? '예: 신용카드, 체크카드, 카카오페이' : 'e.g. Credit Card, Debit Card'}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 dark:border-atl-dark-border rounded-xl px-4 py-2 bg-white dark:bg-atl-dark-surface text-gray-900 dark:text-atl-dark-text-strong focus:ring-2 focus:ring-atl-blue-500 focus:border-atl-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-atl-dark-text mb-1">
              {language === 'kr' ? '금액 (원)' : 'Amount (KRW)'}
            </label>
            <input 
              type="number" 
              required
              min="0"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 dark:border-atl-dark-border rounded-xl px-4 py-2 bg-white dark:bg-atl-dark-surface text-gray-900 dark:text-atl-dark-text-strong focus:ring-2 focus:ring-atl-blue-500 focus:border-atl-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-atl-dark-text mb-1">
               {language === 'kr' ? '메모 (선택)' : 'Memo (Optional)'}
             </label>
            <input 
              type="text" 
              placeholder={language === 'kr' ? '내역 상세 입력' : 'Additional details'}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 dark:border-atl-dark-border rounded-xl px-4 py-2 bg-white dark:bg-atl-dark-surface text-gray-900 dark:text-atl-dark-text-strong focus:ring-2 focus:ring-atl-blue-500 focus:border-atl-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-atl-dark-border">
             <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-atl-dark-bg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-atl-dark-text-strong rounded-xl font-medium transition-colors"
            >
              {language === 'kr' ? '취소' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-atl-blue-600 hover:bg-atl-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                language === 'kr' ? '저장하기' : 'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
