
export interface Entry {
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
}

export interface TransactionEntryFormData {
  day: string;
  amount: string;
  description: string;
  category: string;
}