'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import GNB, { ViewMode } from '@/components/GNB';
import CalendarView from '@/components/views/CalendarView';
import CardSummaryView from '@/components/views/CardSummaryView';
import DashboardView from '@/components/views/DashboardView';
import { Wallet, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCsvUploading, setIsCsvUploading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx),
      });

      if (!res.ok) throw new Error('API request failed');

      // Refresh list after successful add
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to add transaction', error);
      alert('데이터 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCsvUpload = async (newTxs: Omit<Transaction, 'id'>[]) => {
    try {
      setIsCsvUploading(true);
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTxs), // backend now supports batch array
      });

      if (!res.ok) throw new Error('Batch API request failed');

      alert(`${newTxs.length}건의 데이터가 성공적으로 업로드되었습니다!`);
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to upload CSV', error);
      alert('CSV 데이터 업로드에 실패했습니다.');
    } finally {
      setIsCsvUploading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      // Optimistic Update
      const prevTransactions = [...transactions];
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      const res = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        // Revert on failure
        setTransactions(prevTransactions);
        throw new Error('Delete API failed');
      }
    } catch (error) {
      console.error('Failed to delete transaction', error);
      alert('데이터 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-atl-dark-bg text-slate-900 dark:text-atl-dark-text-strong pb-24 font-sans selection:bg-atl-blue-100 dark:selection:bg-atl-blue-900 transition-colors duration-200">
      {/* Header Decorative Background */}
      <div className="bg-slate-100 dark:bg-atl-blue-900 h-52 absolute top-0 left-0 w-full -z-10 rounded-b-[3rem] transition-colors duration-200"></div>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <header className="mb-8 flex justify-between items-start sm:items-end flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
              <Wallet className="w-8 h-8 text-atl-blue-500 dark:text-white" />
              {language === 'kr' ? '나의 가계부' : 'My BudgetBook'}
            </h1>
            <p className="text-slate-500 dark:text-blue-200 font-medium">
              {language === 'kr' ? '스마트하게 관리하는 자산 현황' : 'Managing your assets smartly'}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/25 hover:bg-slate-300 dark:hover:bg-white/40 shadow border border-slate-300 dark:border-white/40 text-slate-700 dark:text-white font-semibold text-sm transition-colors"
              title="언어 변경 / Language"
            >
              <Globe size={16} />
              {language === 'kr' ? 'EN' : 'KR'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-200/80 dark:bg-white/25 hover:bg-slate-300 dark:hover:bg-white/40 shadow border border-slate-300 dark:border-white/40 text-slate-700 dark:text-white transition-colors"
              title="테마 변경 / Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-white/25 shadow flex items-center justify-center border border-slate-300 dark:border-white/40 text-slate-700 dark:text-white font-bold ml-1">
              Me
            </div>
          </div>
        </header>

        <GNB 
          currentView={viewMode} 
          onViewChange={setViewMode} 
          onCsvUpload={handleCsvUpload} 
          isUploading={isCsvUploading} 
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-atl-blue-200 border-t-atl-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-atl-blue-600 font-medium animate-pulse">데이터를 동기화하는 중...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Dashboard transactions={transactions} />
            
            {viewMode === 'list' && (
              <TransactionList 
                transactions={transactions} 
                onDelete={handleDeleteTransaction}
              />
            )}

            {viewMode === 'calendar' && (
              <div className="grid md:grid-cols-2 gap-6">
                 <CalendarView transactions={transactions} />
                 <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
              </div>
            )}

            {viewMode === 'card' && (
              <CardSummaryView transactions={transactions} />
            )}

            {viewMode === 'dashboard' && (
              <DashboardView transactions={transactions} />
            )}
          </div>
        )}
      </main>

      <TransactionForm onAdd={handleAddTransaction} isLoading={isSubmitting} />
    </div>
  );
}
