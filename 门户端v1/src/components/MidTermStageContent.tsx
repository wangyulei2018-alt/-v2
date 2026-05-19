import React from 'react';
import { MetricCard, Metric, ViewMode } from './MetricCard';

interface MidTermStageContentProps {
  financialMetrics: Metric[];
  setFinancialMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  customerMetrics: Metric[];
  setCustomerMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  operationalMetrics: Metric[];
  setOperationalMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  orgMetrics: Metric[];
  setOrgMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  isSidebarCollapsed: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  viewMode?: ViewMode;
  showFullForm?: boolean;
  isDetailView?: boolean;
  currentUserRole?: string;
}

export const MidTermStageContent = ({
  financialMetrics,
  setFinancialMetrics,
  customerMetrics,
  setCustomerMetrics,
  operationalMetrics,
  setOperationalMetrics,
  orgMetrics,
  setOrgMetrics,
  isSidebarCollapsed,
  readOnly = false,
  fullWidth = false,
  viewMode = 'department',
  showFullForm = false,
  isDetailView = false,
  currentUserRole
}: MidTermStageContentProps) => {
  return (
    <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'p-2 sm:px-4' : 'p-4'}`}>
      <div className={`mx-auto space-y-3 transition-all duration-300 ${fullWidth ? 'max-w-full' : isSidebarCollapsed ? 'max-w-full' : 'max-w-[1400px]'}`}>
        {(!(viewMode === 'stakeholder' && financialMetrics.length === 0)) && (
          <MetricCard 
            title="财务指标" 
            metrics={financialMetrics} 
            setMetrics={setFinancialMetrics} 
            readOnly={readOnly}
            activeStep={1}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}
        {(!(viewMode === 'stakeholder' && customerMetrics.length === 0)) && (
          <MetricCard 
            title="客户指标" 
            metrics={customerMetrics} 
            setMetrics={setCustomerMetrics} 
            readOnly={readOnly}
            activeStep={1}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}
        {(!(viewMode === 'stakeholder' && operationalMetrics.length === 0)) && (
          <MetricCard 
            title="运营指标" 
            metrics={operationalMetrics} 
            setMetrics={setOperationalMetrics} 
            readOnly={readOnly}
            activeStep={1}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}
        {(!(viewMode === 'stakeholder' && orgMetrics.length === 0)) && (
          <MetricCard 
            title="组织发展指标" 
            metrics={orgMetrics} 
            setMetrics={setOrgMetrics} 
            readOnly={readOnly}
            activeStep={1}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}
        <div className="h-10"></div>
      </div>
    </div>
  );
};
