import React, { useState } from 'react';
import { Transaction } from '@/types';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIES = {
  income: ['급여', '용돈', '이자', '상여금', '기타'],
  expense: ['식비', '교통비', '통신비', '문화/생활', '주거', '건강', '쇼핑', '기타'],
};

export default function TransactionForm({ onAdd, isLoading }: TransactionFormProps) {
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
        className="fixed bottom-8 right-8 bg-socar-600 text-white p-4 rounded-full shadow-lg hover:bg-socar-700 hover:shadow-xl hover:scale-105 transition-all text-gray-800"
        title="내역 추가"
      >
        <PlusCircle size={32} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-800">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <h2 className="text-2xl font-bold mb-6">새 내역 추가</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'expense' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTypeChange('expense')}
            >
              지출
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'income' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTypeChange('income')}
            >
              수입
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-socar-500 focus:border-socar-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-socar-500 focus:border-socar-500 outline-none"
            >
              {CATEGORIES[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">결제수단</label>
            <input 
              type="text" 
              required
              placeholder="예: 신용카드, 체크카드, 카카오페이"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-socar-500 focus:border-socar-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">금액 (원)</label>
            <input 
              type="number" 
              required
              min="0"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-socar-500 focus:border-socar-500 outline-none"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
            <input 
              type="text" 
              placeholder="내역 상세 입력"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-socar-500 focus:border-socar-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
             <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-socar-600 hover:bg-socar-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                '저장하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
