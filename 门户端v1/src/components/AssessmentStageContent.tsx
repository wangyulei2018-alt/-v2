import React from 'react';
import { MetricCard, Metric, ViewMode } from './MetricCard';

interface AssessmentStageContentProps {
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
  readOnly?: boolean;
  fullWidth?: boolean;
  viewMode?: ViewMode;
  showFullForm?: boolean;
  isDetailView?: boolean;
  deptHeadName?: string;
  currentUserRole?: string;
}

export const AssessmentStageContent = ({
  financialMetrics,
  setFinancialMetrics,
  customerMetrics,
  setCustomerMetrics,
  operationalMetrics,
  setOperationalMetrics,
  orgMetrics,
  setOrgMetrics,
  isSidebarCollapsed,
  activeStep,
  readOnly = false,
  fullWidth = false,
  viewMode = 'department',
  showFullForm = false,
  isDetailView = false,
  deptHeadName = '张三',
  currentUserRole
}: AssessmentStageContentProps) => {
  const isApprovalAssessment = viewMode === 'executive' && activeStep === 2 && isDetailView;

  const allMetrics = [...financialMetrics, ...customerMetrics, ...operationalMetrics, ...orgMetrics];

  const calculateTotalScore = (scoreKey: 'selfScore' | 'standingCommitteeScore') => {
    const total = allMetrics.reduce((acc, m) => {
      const score = m[scoreKey] || 0;
      const weight = m.weight || 0;
      return acc + (score * weight) / 100;
    }, 0);
    return total.toFixed(2);
  };

  const selfTotalScore = calculateTotalScore('selfScore');
  const committeeTotalScore = calculateTotalScore('standingCommitteeScore');

  const [standingCommitteeLevel, setStandingCommitteeLevel] = React.useState('B');
  return (
    <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'p-2 sm:px-4' : 'p-4'}`}>
      <div className={`mx-auto space-y-3 transition-all duration-300 ${fullWidth ? 'max-w-full' : isSidebarCollapsed ? 'max-w-full' : 'max-w-[1400px]'}`}>
        {(!(viewMode === 'stakeholder' && financialMetrics.length === 0)) && (
          <MetricCard 
            title="财务指标" 
            metrics={financialMetrics} 
            setMetrics={setFinancialMetrics} 
            readOnly={readOnly}
            activeStep={activeStep}
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
            activeStep={activeStep}
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
            activeStep={activeStep}
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
            activeStep={activeStep}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}

        {/* Redundant Score Summary Result card removed as per user request. 
            The summary is now handled by the AssessmentFooter component. */}

        <div className="h-24"></div>
      </div>
    </div>
  );
};
