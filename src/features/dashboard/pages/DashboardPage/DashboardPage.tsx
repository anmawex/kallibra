import { useState } from 'react';
import { Header } from '../../components';
import { FilterPanel } from '@/features/filters';
import { StatsSummary, StatusDistributionChart } from '@/features/insights';
import { TransactionsTable, useTransactions } from '@/features/transactions';
import { ReconciliationModal } from '@/features/reconciliation';
import type { Transaction } from '@/features/transactions';

export const DashboardPage = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const isReconciliationModalOpen = !!selectedTransaction;

  const {
    filteredTransactions,
    filters,
    setFilters,
    updateTransactionStatus,
    bulkUpdateStatus,
    refreshData,
    totalCount,
    filteredCount,
    transactions, // Need all transactions for matching context
  } = useTransactions();


  const handleReconcile = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleClose = () => {
    setSelectedTransaction(null);
  };

  const handleReconciliationComplete = (transactionIds: string[]) => {
    transactionIds.forEach((id) => {
      updateTransactionStatus(id, 'reconciled');
    });
    handleClose();
  };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header transactionCount={totalCount} onRefresh={refreshData} />
      
      <div className="grid gap-4 px-6 py-4 md:grid-cols-[1fr_300px]">
        <StatsSummary transactions={filteredTransactions} />
        <StatusDistributionChart transactions={filteredTransactions} />
      </div>
      
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
      
      <div className="flex-1 overflow-hidden">
        <TransactionsTable
          transactions={filteredTransactions}
          onUpdateStatus={updateTransactionStatus}
          onBulkUpdateStatus={bulkUpdateStatus}
          onReconcile={handleReconcile}
        />
      </div>

      <ReconciliationModal
        isOpen={isReconciliationModalOpen}
        onClose={() => handleClose()}
        transaction={selectedTransaction}
        candidates={transactions}
        onReconcile={handleReconciliationComplete}
      />

    </div>
  );
};
