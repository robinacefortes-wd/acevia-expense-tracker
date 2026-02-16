import React, { createContext, useContext, useState } from 'react';
import { Transaction, Budget, SavingsData } from '@/types'; // Using your index.ts types

interface StateContextType {
  transactions: Transaction[];
  savings: number;
  budgets: Budget[];
  handleAddTransaction: (t: Transaction) => void;
  handleAddSavings: (s: SavingsData) => void;
  handleEditSavings: (n: number) => void;
  handleCreateBudget: (b: Budget) => void;
  handleEditBudget: (b: Budget) => void;
  handleDeleteBudget: (c: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<number>(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const handleAddTransaction = (transaction: Transaction) => 
    setTransactions([transaction, ...transactions]);
  
  const handleAddSavings = (data: SavingsData) => 
    setSavings(prev => prev + parseFloat(data.amount.toString()));

  const handleEditSavings = (newAmount: number) => 
    setSavings(newAmount);

  const handleCreateBudget = (data: Budget) => {
    const idx = budgets.findIndex(b => b.category === data.category);
    if (idx >= 0) {
      const newB = [...budgets];
      newB[idx] = data;
      setBudgets(newB);
    } else {
      setBudgets([...budgets, data]);
    }
  };

  const handleEditBudget = (data: Budget) => {
    const idx = budgets.findIndex(b => b.category === data.category);
    if (idx >= 0) {
      const newB = [...budgets];
      newB[idx] = data;
      setBudgets(newB);
    }
  };

  const handleDeleteBudget = (category: string) => 
    setBudgets(budgets.filter(b => b.category !== category));

  return (
    <StateContext.Provider value={{ 
      transactions, savings, budgets, 
      handleAddTransaction, handleAddSavings, handleEditSavings,
      handleCreateBudget, handleEditBudget, handleDeleteBudget 
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error("useGlobalState must be used within StateProvider");
  return context;
};