import DashboardLayout from "../components/DashboardLayout";
import { FinancialDashboardSection } from "../components/FinancialDashboardSection";

export const Beranda = () => {
  return (
    <DashboardLayout>
      <FinancialDashboardSection />
    </DashboardLayout>
  );
};

export default Beranda;