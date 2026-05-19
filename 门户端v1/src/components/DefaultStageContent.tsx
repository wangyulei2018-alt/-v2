import React from 'react';
import { MetricCard, Metric } from './MetricCard';

interface DefaultStageContentProps {
  financialMetrics: Metric[];
  setFinancialMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  customerMetrics: Metric[];
  setCustomerMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  operationalMetrics: Metric[];
  setOperationalMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  orgMetrics: Metric[];
  setOrgMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  isSidebarCollapsed: boolean;
  activeStep: number;
}

export const DefaultStageContent: React.FC<DefaultStageContentProps> = ({
  financialMetrics,
  setFinancialMetrics,
  customerMetrics,
  setCustomerMetrics,
  operationalMetrics,
  setOperationalMetrics,
  orgMetrics,
  setOrgMetrics,
  isSidebarCollapsed,
  activeStep
}) => {
  return (
    <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'p-2 sm:px-4' : 'p-4'}`}>
      <div className={`mx-auto space-y-3 transition-all duration-300 ${isSidebarCollapsed ? 'max-w-full' : 'max-w-[1400px]'}`}>
        <MetricCard 
          title="财务指标" 
          metrics={financialMetrics} 
          setMetrics={setFinancialMetrics} 
          readOnly={true}
          activeStep={activeStep}
        />
        <MetricCard 
          title="客户指标" 
          metrics={customerMetrics} 
          setMetrics={setCustomerMetrics} 
          readOnly={true}
          activeStep={activeStep}
        />
        <MetricCard 
          title="运营指标" 
          metrics={operationalMetrics} 
          setMetrics={setOperationalMetrics} 
          readOnly={true}
          activeStep={activeStep}
        />
        <MetricCard 
          title="组织发展指标" 
          metrics={orgMetrics} 
          setMetrics={setOrgMetrics} 
          readOnly={true}
          activeStep={activeStep}
        />
        <div className="h-10"></div>
      </div>
    </div>
  );
};
