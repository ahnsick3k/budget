export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string; // e.g. '신용카드', '현금', '계좌이체'
  amount: number;
  memo: string;
}
