export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  monthlyIncome: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Expense {
  _id: string;
  amount: number;
  date: string;
  description?: string;
  category: Category | null;
}

export interface Period {
  /** 1 to 12 */
  month: number;
  year: number;
}

export interface MonthlyExpenses extends Period {
  expenses: Expense[];
  totalExpenses: number;
}

export interface MonthlyStatistics extends Period {
  totalExpenses: number;
  remainingIncome: number;
  averageDailyExpense: number;
}

export interface CategoryStatistics extends Period {
  categoryStatistics: Record<string, number>;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  description?: string;
  date?: string;
}

export interface RegisterInput {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}
