// interface to define structure of Entry object
export interface Entry {
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
}

// interface to define structure of form data for adding a new transaction
export interface TransactionEntryFormData {
  day: string;
  amount: string;
  description: string;
  category: string;
}

export interface PlannedAmount {
  category: string;
  amount: number;
}

export interface MonthYearAmountCategoryTypes {
  monthYear: string,
  plannedAmounts: PlannedAmount[]
}