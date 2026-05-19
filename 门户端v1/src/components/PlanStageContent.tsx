import React from 'react';
import { MetricCard, Metric, ViewMode } from './MetricCard';
import { FileEdit } from 'lucide-react';

interface PlanStageContentProps {
  financialMetrics: Metric[];
  setFinancialMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  customerMetrics: Metric[];
  setCustomerMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  operationalMetrics: Metric[];
  setOperationalMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  orgMetrics: Metric[];
  setOrgMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  capacityMetrics?: Metric[];
  setCapacityMetrics?: React.Dispatch<React.SetStateAction<Metric[]>>;
  isSidebarCollapsed: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  viewMode?: ViewMode;
  showFullForm?: boolean;
  isDetailView?: boolean;
  currentUserRole?: string;
  planChangeReason?: string | null;
  departmentType?: string;
  addedDimensions?: string[];
}

export const PlanStageContent = ({
  financialMetrics,
  setFinancialMetrics,
  customerMetrics,
  setCustomerMetrics,
  operationalMetrics,
  setOperationalMetrics,
  orgMetrics,
  setOrgMetrics,
  capacityMetrics = [],
  setCapacityMetrics,
  isSidebarCollapsed,
  readOnly = false,
  fullWidth = false,
  viewMode = 'department',
  showFullForm = false,
  isDetailView = false,
  currentUserRole,
  planChangeReason,
  departmentType = '经营单元',
  addedDimensions = []
}: PlanStageContentProps) => {
  return (
    <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'p-2 sm:px-4' : 'p-4'}`}>
      <div className={`mx-auto space-y-3 transition-all duration-300 ${fullWidth ? 'max-w-full' : isSidebarCollapsed ? 'max-w-full' : 'max-w-[1400px]'}`}>
        
        {planChangeReason && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FileEdit size={18} className="text-amber-600" />
              <h3 className="font-bold text-amber-800 text-sm">计划变更原因</h3>
            </div>
            <p className="text-sm text-amber-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-amber-100/50">
              {planChangeReason}
            </p>
          </div>
        )}

        {(!(viewMode === 'stakeholder' && financialMetrics.length === 0)) && (departmentType === '经营单元' || addedDimensions.includes('财务指标')) && (
          <MetricCard 
            title="财务指标" 
            metrics={financialMetrics} 
            setMetrics={setFinancialMetrics} 
            readOnly={readOnly}
            activeStep={0}
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
            activeStep={0}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}
        {(!(viewMode === 'stakeholder' && operationalMetrics.length === 0)) && (departmentType === '经营单元' || addedDimensions.includes('运营指标')) && (
          <MetricCard 
            title="运营指标" 
            metrics={operationalMetrics} 
            setMetrics={setOperationalMetrics} 
            readOnly={readOnly}
            activeStep={0}
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
            activeStep={0}
            viewMode={viewMode}
            showFullForm={showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        )}
        {departmentType === '职能部门/能力中心' && addedDimensions.includes('能力建设指标') && (
          <MetricCard 
            title="能力建设指标" 
            metrics={capacityMetrics} 
            setMetrics={setCapacityMetrics || (() => {})}
            readOnly={readOnly}
            activeStep={0}
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
