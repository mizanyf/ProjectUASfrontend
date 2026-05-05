import { useApp } from "../../context/AppContext";
import { SummaryCards } from "./SummaryCards";
import { RecentTransactionsSection } from "./RecentTransactionsSection";
import { PaymentAgendaSection } from "./PaymentAgendaSection";
import { BudgetChartSection } from "./BudgetChartSection";
import { IncomeExpenseChart } from "./IncomeExpenseChart";

export const FinancialDashboardSection = ({ onViewAll }) => {
  const { transactions } = useApp();

  // Latest 5 transactions for "recent" widget
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary Cards — show all-time data on dashboard */}
      <SummaryCards variant="dashboard" />

      {/* Charts & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <IncomeExpenseChart />
        <BudgetChartSection />
      </div>

      {/* Recent Transactions & Payment Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentTransactionsSection transactions={recentTransactions} onViewAll={onViewAll} />
        <PaymentAgendaSection />
      </div>
    </div>
  );
};

export default FinancialDashboardSection;