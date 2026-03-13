import React, { useRef } from 'react';
import { UploadCloud, LayoutList, Calendar, CreditCard, PieChart } from 'lucide-react';
import Papa from 'papaparse';
import { Transaction } from '@/types';

export type ViewMode = 'list' | 'calendar' | 'card' | 'dashboard';

interface GNBProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onCsvUpload: (transactions: Omit<Transaction, 'id'>[]) => Promise<void>;
  isUploading: boolean;
}

export default function GNB({ currentView, onViewChange, onCsvUpload, isUploading }: GNBProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Expected CSV Headers: Date, Type, Category, PaymentMethod, Amount, Memo
        const parsedData = results.data.map((row: any /* eslint-disable-line */) => ({
          date: row['Date'] || row['날짜'] || new Date().toISOString().split('T')[0],
          type: (row['Type'] || row['유형'] || 'expense').toLowerCase() === 'income' || row['수입'] ? 'income' : 'expense',
          category: row['Category'] || row['카테고리'] || '기타',
          paymentMethod: row['PaymentMethod'] || row['결제수단'] || '기본',
          amount: Number(row['Amount'] || row['금액']?.replace(/,/g, '')) || 0,
          memo: row['Memo'] || row['메모'] || '',
        }));

        if (parsedData.length > 0) {
          await onCsvUpload(parsedData as any /* eslint-disable-line */);
        }
        
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (error) => {
        console.error('Error parsing CSV', error);
        alert('CSV 파일 파싱에 실패했습니다.');
      }
    });
  };

  const navItems = [
    { id: 'list', label: '목록', icon: LayoutList },
    { id: 'calendar', label: '달력', icon: Calendar },
    { id: 'card', label: '카드별', icon: CreditCard },
    { id: 'dashboard', label: '통계', icon: PieChart },
  ];

  return (
    <nav className="flex items-center justify-between mb-8 bg-white/20 dark:bg-atl-dark-surface/50 backdrop-blur-md rounded-2xl p-2 border border-white/30 dark:border-white/10 shadow-sm relative z-10 transition-colors">
      <div className="flex gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentView === item.id 
                ? 'bg-white dark:bg-atl-blue-600 text-atl-blue-700 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-atl-dark-text hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <item.icon size={16} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      <div>
        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 bg-atl-blue-500/10 dark:bg-atl-blue-500/30 hover:bg-atl-blue-500/20 dark:hover:bg-atl-blue-500/50 text-atl-blue-700 dark:text-white rounded-xl text-sm font-medium transition-all border border-atl-blue-400/30 disabled:opacity-50"
        >
          {isUploading ? (
            <span className="w-4 h-4 border-2 border-atl-blue-700/30 dark:border-white/30 border-t-atl-blue-700 dark:border-t-white rounded-full animate-spin"></span>
          ) : (
             <UploadCloud size={16} />
          )}
          <span className="hidden sm:inline">{isUploading ? '업로드 중...' : 'CSV 업로드'}</span>
        </button>
      </div>
    </nav>
  );
}
