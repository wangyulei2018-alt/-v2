import React, { useState } from 'react';
import { HelpCircle, Plus, ChevronUp, Maximize2, UserPlus, Trash2, X, Search, ChevronDown, Library } from 'lucide-react';
import { ReviewerModal } from './ReviewerModal';
import { EmployeeModal } from './EmployeeModal';
import { MetricLibraryModal } from './MetricLibraryModal';

export interface ReviewerInfo {
  id: string;
  name: string;
  weight: number;
  isManager?: boolean;
  avatar?: string;
  title?: string;
  empId?: string;
  departmentPath?: string;
}

export interface EmployeeInfo {
  id: string;
  name: string;
  title?: string;
  empId?: string;
  avatar?: string;
  departmentPath?: string;
}

export interface StakeholderScore {
  id: string;
  name: string;
  score: number;
  weight: number;
}

export interface Metric {
  id: string;
  name: string;
  type: string;
  zeroGoal: string;
  threeGoal: string;
  fiveGoal: string;
  weight: number;
  reviewer: string;
  reviewerWeight: number;
  reviewers?: ReviewerInfo[];
  lastYear: string;
  yoyGrowth: string;
  provider: string;
  providers?: EmployeeInfo[];
  formula: string;
  midTermResult?: string;
  midTermProgress?: number;
  midTermStatus?: 'red' | 'yellow' | 'blue' | 'green' | '';
  midTermReason?: string;
  annualResult?: string;
  selfScore?: number;
  stakeholderScores?: StakeholderScore[];
  executiveScore?: number;
  standingCommitteeScore?: number;
  providerScore?: number;
}

export type ViewMode = 'department' | 'executive' | 'stakeholder' | 'process' | 'dashboard';

export function MetricCard({ 
  title, 
  metrics, 
  setMetrics,
  readOnly = false,
  activeStep = 0,
  viewMode = 'department',
  showFullForm = false,
  isDetailView = false,
  currentUserRole
}: { 
  title: string; 
  metrics: Metric[]; 
  setMetrics: (m: Metric[]) => void;
  readOnly?: boolean;
  activeStep?: number;
  viewMode?: ViewMode;
  showFullForm?: boolean;
  isDetailView?: boolean;
  currentUserRole?: string;
}) {
  const [expandedField, setExpandedField] = useState<{id: string, field: string, title: string} | null>(null);
  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isMetricLibraryOpen, setIsMetricLibraryOpen] = useState(false);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [showDataProviderHelp, setShowDataProviderHelp] = useState(false);
  const isMidTerm = activeStep === 1;
  const isAssessment = activeStep === 2;
  const isPlan = activeStep === 0;
  const isDataProvider = currentUserRole === '数据提供人';
  const isMainBP = currentUserRole === '主BP';
  const isFieldReadOnly = readOnly || isAssessment || (isMidTerm && viewMode === 'department') || (isMainBP && !isPlan);

  const shouldHideFields = viewMode === 'executive' && (activeStep === 0 || activeStep === 1) && isDetailView && !showFullForm && currentUserRole !== '分管常委';
  const isApprovalAssessment = viewMode === 'executive' && activeStep === 2 && isDetailView;
  const isApprovalPlan = viewMode === 'executive' && activeStep === 0 && isDetailView;
  const isAnyApprovalDetail = viewMode === 'executive' && isDetailView;

  const fontSize = (viewMode === 'stakeholder' || viewMode === 'executive') ? 'text-xs' : 'text-[11px]';
  const labelSize = (viewMode === 'stakeholder' || viewMode === 'executive') ? 'text-[11px]' : 'text-[10px]';
  const smallSize = (viewMode === 'stakeholder' || viewMode === 'executive') ? 'text-[10px]' : 'text-[9px]';

  const handleAddMetric = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    setMetrics([...metrics, {
      id: newId,
      name: '',
      type: '定量',
      zeroGoal: '',
      threeGoal: '',
      fiveGoal: '',
      weight: 0,
      reviewer: '',
      reviewerWeight: 0,
      reviewers: [],
      lastYear: '',
      yoyGrowth: '',
      provider: '',
      providers: [],
      formula: ''
    }]);
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  const handleImportMetrics = (selectedMetrics: any[]) => {
    const newMetrics = selectedMetrics.map(item => ({
      id: Math.random().toString(36).substring(2, 9),
      name: item.name,
      type: '定量',
      zeroGoal: '',
      threeGoal: '',
      fiveGoal: '',
      weight: 0,
      reviewer: '',
      reviewerWeight: 0,
      reviewers: [],
      lastYear: '',
      yoyGrowth: '',
      provider: '',
      providers: [],
      formula: item.formula
    }));
    setMetrics([...metrics, ...newMetrics]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="h-16 px-6 border-b border-blue-100 bg-[#f0f6fc] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          <h2 className={`${(viewMode === 'stakeholder' || viewMode === 'executive') ? 'text-[17px]' : 'text-[15px]'} font-bold text-slate-800`}>{title}</h2>
          {isPlan && <span className="text-red-500 text-[12px] font-medium ml-1">（必选）</span>}
          <HelpCircle size={14} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-3">
          {!readOnly && !isAssessment && !isMidTerm && viewMode !== 'stakeholder' && (
            <>
              <button 
                onClick={() => setIsMetricLibraryOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium ${fontSize}`}
              >
                <Library size={14} /> 引用指标库
              </button>
              <button onClick={handleAddMetric} className={`flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium ${fontSize}`}>
                <Plus size={14} /> 添加新指标
              </button>
            </>
          )}
          <button className="p-1 text-slate-400 hover:text-slate-600">
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[1400px]">
          <thead>
            <tr className={`bg-slate-50 text-slate-500 ${fontSize} uppercase tracking-wider whitespace-nowrap`}>
              <th className={`px-1 py-3 font-medium ${(shouldHideFields && currentUserRole !== '分管常委' && currentUserRole !== '相关方') ? 'w-8' : 'w-16'} text-center`}>
                <div className="flex items-center justify-center gap-1.5">
                  {!readOnly && !isAssessment && viewMode !== 'stakeholder' && !isMidTerm && <input type="checkbox" className="rounded border-slate-300" />}
                  <span>序号</span>
                </div>
              </th>
              <th className={`px-1 py-3 font-medium ${shouldHideFields ? 'w-[10.13%]' : isApprovalAssessment ? 'w-[12%]' : (isAssessment && isDataProvider) ? 'w-[12%]' : 'w-[9%]'}`}>指标名称</th>
              {isApprovalAssessment && currentUserRole === '分管常委' && <th className="px-1 py-3 font-medium w-[5%]">指标权重</th>}
              {!isApprovalAssessment && <th className={`px-1 py-3 font-medium ${(isAssessment && isDataProvider) ? 'w-[8%]' : 'w-[5%]'}`}>指标权重</th>}
              {!isMidTerm && !shouldHideFields && (!isAnyApprovalDetail || (viewMode === 'executive' && activeStep === 0 && showFullForm)) && <th className={`px-1 py-3 font-medium ${(isAssessment && isDataProvider) ? 'w-[9%]' : 'w-[6%]'}`}>指标类型</th>}
              <th className={`px-1 py-3 font-medium ${shouldHideFields ? 'w-[15.17%]' : isAssessment ? 'w-[13%]' : isMidTerm ? 'w-[13%]' : 'w-[10%]'}`}>零分目标</th>
              <th className={`px-1 py-3 font-medium ${shouldHideFields ? 'w-[15.17%]' : isAssessment ? 'w-[13%]' : isMidTerm ? 'w-[13%]' : 'w-[10%]'}`}>三分目标</th>
              <th className={`px-1 py-3 font-medium ${shouldHideFields ? 'w-[15.17%]' : isAssessment ? 'w-[13%]' : isMidTerm ? 'w-[13%]' : 'w-[10%]'}`}>五分目标</th>
              {!isMidTerm && !isAssessment && <th className="px-1 py-3 font-medium w-[75px]">上年同期</th>}
              {!isMidTerm && !isAssessment && <th className="px-1 py-3 font-medium w-[95px]">同比增长率</th>}
              {!shouldHideFields && (!isAnyApprovalDetail || (viewMode === 'executive' && activeStep === 0 && showFullForm)) && !isDataProvider && <th className="px-1 py-3 font-medium w-[6%]">数据提供人</th>}
              {!isMidTerm && !isApprovalAssessment && !isDataProvider && <th className={`px-1 py-3 font-medium ${shouldHideFields ? 'w-[8.4%]' : 'w-[7%]'}`}>考核人及权重</th>}
              {!isMidTerm && !isAssessment && !shouldHideFields && <th className="px-1 py-3 font-medium w-[6%]">计算公式</th>}
              {isMidTerm && (
                <>
                  <th className={`px-1 py-3 font-medium ${isDataProvider ? 'w-[10%]' : 'w-[8%]'}`}>上半年完成结果</th>
                  <th className={`px-1 py-3 font-medium ${isDataProvider ? 'w-[10%]' : 'w-[8%]'}`}>上半年完成进度</th>
                  <th className={`px-1 py-3 font-medium ${isDataProvider ? 'w-[12%]' : 'w-[10%]'}`}>红黄蓝绿灯</th>
                  <th className={`px-1 py-3 font-medium ${isMidTerm ? 'w-[15%]' : 'w-[12%]'}`}>差距原因及改进计划</th>
                </>
              )}
              {isAssessment && (
                <>
                  <th className={`px-1 py-3 font-medium ${isApprovalAssessment ? 'w-[18%]' : isDataProvider ? 'w-[18%]' : 'w-[13%]'}`}>年度完成结果</th>
                  {isApprovalAssessment ? (
                    <>
                      <th className="px-1 py-3 font-medium w-[10%] text-center">一级部门自评分</th>
                      <th className="px-1 py-3 font-medium w-[14%]">相关方评分</th>
                      <th className="px-1 py-3 font-medium w-[10%] text-center">分管常委/执委评分</th>
                    </>
                  ) : (
                    <>
                      {viewMode === 'stakeholder' && (
                        <th className="px-1 py-3 font-medium w-[8%]">
                          <div className="flex items-center gap-1">
                            数据提供人初评
                            <div className="relative">
                              <HelpCircle 
                                size={12} 
                                className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" 
                                onClick={() => setShowDataProviderHelp(!showDataProviderHelp)}
                              />
                              {showDataProviderHelp && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 pointer-events-none font-normal normal-case text-left leading-relaxed">
                                  <div className="font-bold mb-1 text-blue-300">评分说明：</div>
                                  定量指标由系统根据完成目标自动计算；定性指标由数据提供人根据实际完成情况手工录入。
                                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-800"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </th>
                      )}
                      {viewMode !== 'stakeholder' && (
                        <>
                          {!isApprovalAssessment && (
                            <th className="px-1 py-3 font-medium w-[8%]">
                              <div className="flex items-center gap-1">
                                数据提供人初评
                                <div className="relative">
                                  <HelpCircle 
                                    size={12} 
                                    className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" 
                                    onClick={() => setShowDataProviderHelp(!showDataProviderHelp)}
                                  />
                                  {showDataProviderHelp && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 pointer-events-none font-normal normal-case text-left leading-relaxed">
                                      <div className="font-bold mb-1 text-blue-300">评分说明：</div>
                                      定量指标由系统根据完成目标自动计算；定性指标由数据提供人根据实际完成情况手工录入。
                                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-800"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </th>
                          )}
                          {!isDataProvider && !isMainBP && <th className="px-1 py-3 font-medium w-[8%]">一级部门自评分</th>}
                        </>
                      )}
                      {viewMode !== 'department' && (
                        <th className={`px-1 py-3 font-medium ${viewMode === 'stakeholder' ? 'w-[15%]' : 'w-[10%]'}`}>
                          相关方评分
                        </th>
                      )}
                      {viewMode !== 'stakeholder' && viewMode !== 'department' && (
                        <th className="px-1 py-3 font-medium w-[10%]">分管常委/执委评分</th>
                      )}
                    </>
                  )}
                </>
              )}
              {!readOnly && !isAssessment && !isMidTerm && <th className="px-1 py-3 font-medium w-12 text-center">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {metrics.map((metric, index) => (
            <tr key={metric.id} className="hover:bg-slate-50/50 align-top">
              <td className="px-1 py-3 text-center align-top">
                <div className={`flex items-start justify-center gap-1.5 mx-auto h-[70px] pt-1.5 ${(shouldHideFields && currentUserRole !== '分管常委' && currentUserRole !== '相关方') ? 'w-8' : 'w-16'}`}>
                  {!readOnly && !isAssessment && viewMode !== 'stakeholder' && !isMidTerm && <input type="checkbox" className="rounded border-slate-300 mt-1" />}
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded bg-blue-50 text-blue-600 font-medium ${fontSize}`}>{index + 1}</span>
                </div>
              </td>
              <td className={`px-1 py-3 align-top ${shouldHideFields ? 'w-[10.13%]' : isApprovalAssessment ? 'w-[12%]' : (isAssessment && isDataProvider) ? 'w-[12%]' : 'w-[9%]'}`}>
                <div className="relative group h-[70px] flex items-start">
                  <textarea 
                    className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                    value={metric.name}
                    readOnly={isFieldReadOnly}
                    rows={2}
                    onChange={(e) => {
                      if (isFieldReadOnly) return;
                      const newMetrics = [...metrics];
                      newMetrics[index].name = e.target.value;
                      setMetrics(newMetrics);
                    }}
                  />
                  <button 
                    onClick={() => setExpandedField({id: metric.id, field: 'name', title: '指标名称'})}
                    className="absolute bottom-1 right-1 p-1 bg-white shadow-sm border border-slate-200 rounded text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </td>
              {isApprovalAssessment && currentUserRole === '分管常委' && (
                <td className="px-1 py-3 align-top">
                  <div className={`h-[70px] border border-slate-200 rounded bg-slate-50 flex items-start justify-start p-1.5 font-bold text-slate-600 ${fontSize}`}>
                    {metric.weight}%
                  </div>
                </td>
              )}
              {!isApprovalAssessment && (
                <td className="px-1 py-3 align-top">
                  <div className="h-[70px] flex items-start">
                    <div className="flex items-center gap-1 font-medium w-full">
                      <input 
                        type="number" 
                        className={`w-full h-[70px] p-1.5 text-left border border-slate-200 rounded outline-none focus:border-blue-500 ${fontSize} ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                        value={metric.weight}
                        readOnly={isFieldReadOnly}
                        onChange={(e) => {
                          if (isFieldReadOnly) return;
                          const newMetrics = [...metrics];
                          newMetrics[index].weight = Number(e.target.value);
                          setMetrics(newMetrics);
                        }}
                      />
                      <span className={`text-slate-400 ${fontSize} absolute right-2 top-2`}>%</span>
                    </div>
                  </div>
                </td>
              )}
              {!isMidTerm && !shouldHideFields && (!isAnyApprovalDetail || (viewMode === 'executive' && activeStep === 0 && showFullForm)) && (
              <td className="px-1 py-3 align-top">
                <div className="h-[70px] flex items-start">
                  <select 
                    className={`w-full border border-slate-200 rounded p-1.5 ${fontSize} h-[70px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default appearance-none' : ''}`}
                    value={metric.type}
                    disabled={isFieldReadOnly}
                    onChange={(e) => {
                      if (isFieldReadOnly) return;
                      const newMetrics = [...metrics];
                      newMetrics[index].type = e.target.value;
                      setMetrics(newMetrics);
                    }}
                  >
                    <option>定量</option>
                    <option>定性</option>
                  </select>
                </div>
              </td>
            )}
              <td className={`px-1 py-3 align-top ${shouldHideFields ? 'w-[15.17%]' : isAssessment ? 'w-[13%]' : isMidTerm ? 'w-[13%]' : 'w-[10%]'}`}>
                <div className="relative group h-[70px] flex items-start">
                  <textarea 
                    className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                    value={metric.zeroGoal}
                    readOnly={isFieldReadOnly}
                    rows={2}
                    onChange={(e) => {
                      if (isFieldReadOnly) return;
                      const newMetrics = [...metrics];
                      newMetrics[index].zeroGoal = e.target.value;
                      setMetrics(newMetrics);
                    }}
                  />
                  <button 
                    onClick={() => setExpandedField({id: metric.id, field: 'zeroGoal', title: '零分目标'})}
                    className="absolute bottom-1 right-1 p-1 bg-white shadow-sm border border-slate-200 rounded text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </td>
              <td className={`px-1 py-3 align-top ${shouldHideFields ? 'w-[15.17%]' : isAssessment ? 'w-[13%]' : isMidTerm ? 'w-[13%]' : 'w-[10%]'}`}>
                <div className="relative group h-[70px] flex items-start">
                  <textarea 
                    className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                    value={metric.threeGoal}
                    readOnly={isFieldReadOnly}
                    rows={2}
                    onChange={(e) => {
                      if (isFieldReadOnly) return;
                      const newMetrics = [...metrics];
                      newMetrics[index].threeGoal = e.target.value;
                      setMetrics(newMetrics);
                    }}
                  />
                  <button 
                    onClick={() => setExpandedField({id: metric.id, field: 'threeGoal', title: '三分目标'})}
                    className="absolute bottom-1 right-1 p-1 bg-white shadow-sm border border-slate-200 rounded text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </td>
              <td className={`px-1 py-3 align-top ${shouldHideFields ? 'w-[15.17%]' : isAssessment ? 'w-[13%]' : isMidTerm ? 'w-[13%]' : 'w-[10%]'}`}>
                <div className="relative group h-[70px] flex items-start">
                  <textarea 
                    className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                    value={metric.fiveGoal}
                    readOnly={isFieldReadOnly}
                    rows={2}
                    onChange={(e) => {
                      if (isFieldReadOnly) return;
                      const newMetrics = [...metrics];
                      newMetrics[index].fiveGoal = e.target.value;
                      setMetrics(newMetrics);
                    }}
                  />
                  <button 
                    onClick={() => setExpandedField({id: metric.id, field: 'fiveGoal', title: '五分目标'})}
                    className="absolute bottom-1 right-1 p-1 bg-white shadow-sm border border-slate-200 rounded text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </td>
              {!isMidTerm && !isAssessment && (
                <td className="px-1 py-3 align-top">
                  <div className="relative group h-[70px] flex items-start">
                    <input 
                      className={`w-full h-[70px] border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                      value={metric.lastYear}
                      readOnly={isFieldReadOnly}
                      onChange={(e) => {
                        if (isFieldReadOnly) return;
                        const newMetrics = [...metrics];
                        newMetrics[index].lastYear = e.target.value;
                        setMetrics(newMetrics);
                      }}
                    />
                  </div>
                </td>
              )}
              {!isMidTerm && !isAssessment && (
                <td className="px-1 py-3 align-top">
                  <div className="relative group h-[70px] flex items-start">
                    <input 
                      className={`w-full h-[70px] border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                      value={metric.yoyGrowth}
                      readOnly={isFieldReadOnly}
                      onChange={(e) => {
                        if (isFieldReadOnly) return;
                        const newMetrics = [...metrics];
                        newMetrics[index].yoyGrowth = e.target.value;
                        setMetrics(newMetrics);
                      }}
                    />
                  </div>
                </td>
              )}
              {!shouldHideFields && (!isAnyApprovalDetail || (viewMode === 'executive' && activeStep === 0 && showFullForm)) && !isDataProvider && (
                <td className="px-1 py-3 align-top">
                  <div className="h-[70px] flex flex-col justify-start pt-1.5">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {(metric.providers || []).map((p) => (
                        <span key={p.id} title={p.departmentPath || p.title} className={`bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded ${smallSize} flex items-center gap-1 border border-blue-100 cursor-help`}>
                          {p.name}
                          {!isFieldReadOnly && (
                            <button 
                              onClick={() => {
                                const newMetrics = [...metrics];
                                newMetrics[index].providers = metric.providers?.filter(emp => emp.id !== p.id);
                                setMetrics(newMetrics);
                              }}
                              className="text-blue-400 hover:text-red-500"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {!isFieldReadOnly && (
                      <button 
                        onClick={() => {
                          setEditingMetricId(metric.id);
                          setIsProviderModalOpen(true);
                        }}
                        className={`text-blue-600 ${smallSize} flex items-center gap-0.5 hover:text-blue-700 font-medium`}
                      >
                        <Plus size={10} /> 添加提供人
                      </button>
                    )}
                  </div>
                </td>
              )}
              {!isMidTerm && !isApprovalAssessment && !isDataProvider && (
                <td className={`px-1 py-3 align-top ${shouldHideFields ? 'w-[8.4%]' : 'w-[7%]'}`}>
                  <div className="h-[70px] flex flex-col justify-start pt-1.5">
                    <div className="space-y-1">
                      {metric.reviewers && metric.reviewers.length > 0 ? (
                        <div className="space-y-1">
                          {metric.reviewers.map((r) => (
                            <div key={r.id} className="flex items-center justify-between bg-slate-50 px-1 py-0 rounded border border-slate-100 group/reviewer">
                              <div className="flex items-center gap-0.5 min-w-0">
                                <span className={`${labelSize} font-bold text-slate-700 truncate cursor-help`} title={r.departmentPath || r.title}>{r.name}</span>
                                {r.isManager && <span className={`${smallSize} bg-blue-100 text-blue-600 px-0.5 rounded flex-shrink-0`}>上级</span>}
                              </div>
                              <div className="flex items-center gap-0.5">
                                <span className={`${smallSize} font-bold text-blue-600`}>{r.weight}%</span>
                                {!isFieldReadOnly && (
                                  <button 
                                    onClick={() => {
                                      const newMetrics = [...metrics];
                                      newMetrics[index].reviewers = metric.reviewers?.filter(rev => rev.id !== r.id);
                                      setMetrics(newMetrics);
                                    }}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {!isFieldReadOnly && (
                            <button 
                              onClick={() => {
                                setEditingMetricId(metric.id);
                                setIsReviewerModalOpen(true);
                              }}
                              className={`text-blue-600 ${smallSize} flex items-center gap-0.5 hover:text-blue-700 font-medium`}
                            >
                              <UserPlus size={10} /> 修改考核人
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {!isFieldReadOnly && (
                            <button 
                              onClick={() => {
                                setEditingMetricId(metric.id);
                                setIsReviewerModalOpen(true);
                              }}
                              className={`text-blue-600 ${smallSize} flex items-center gap-0.5 hover:text-blue-700 font-medium`}
                            >
                              <Plus size={10} /> 添加考核人
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              )}
              {!isMidTerm && !isAssessment && !shouldHideFields && (
              <td className="px-1 py-3 align-top">
                <div className="relative group h-[70px] flex items-start">
                  <textarea 
                    className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                    value={metric.formula}
                    readOnly={isFieldReadOnly}
                    rows={2}
                    onChange={(e) => {
                      if (isFieldReadOnly) return;
                      const newMetrics = [...metrics];
                      newMetrics[index].formula = e.target.value;
                      setMetrics(newMetrics);
                    }}
                  />
                  <button 
                    onClick={() => setExpandedField({id: metric.id, field: 'formula', title: '计算公式'})}
                    className="absolute bottom-1 right-1 p-1 bg-white shadow-sm border border-slate-200 rounded text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </td>
            )}
              {isMidTerm && (
                <>
                  <td className="px-1 py-3 align-top">
                    <div className="relative group h-[70px] flex items-start">
                      <textarea 
                        className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${readOnly || isMainBP ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                        value={metric.midTermResult || ''}
                        readOnly={readOnly || isAssessment || isMainBP}
                        rows={2}
                        onChange={(e) => {
                          if (readOnly || isAssessment || isMainBP) return;
                          const newMetrics = [...metrics];
                          newMetrics[index].midTermResult = e.target.value;
                          setMetrics(newMetrics);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-1 py-3 align-top">
                    <div className="relative h-[70px] flex items-start">
                      <div className="flex items-center w-full gap-1">
                        <input 
                          type="number" 
                          className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${readOnly || isMainBP ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`}
                          value={metric.midTermProgress || ''}
                          readOnly={readOnly || isAssessment || isMainBP}
                          placeholder="0"
                          onChange={(e) => {
                            if (readOnly || isAssessment || isMainBP) return;
                            const newMetrics = [...metrics];
                            newMetrics[index].midTermProgress = Number(e.target.value);
                            setMetrics(newMetrics);
                          }}
                        />
                        <span className="text-slate-500 font-medium absolute right-2 top-2">%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 py-3 align-top">
                    <div className="relative h-[70px] flex items-start">
                      <select 
                        className={`w-full h-[70px] border rounded p-1.5 ${fontSize} focus:ring-1 outline-none appearance-none transition-all duration-200 ${
                          metric.midTermStatus === 'red' ? 'text-red-600 bg-red-50 border-red-200 focus:ring-red-500 focus:border-red-500' : 
                          metric.midTermStatus === 'yellow' ? 'text-amber-600 bg-amber-50 border-amber-200 focus:ring-amber-500 focus:border-amber-500' : 
                          metric.midTermStatus === 'blue' ? 'text-blue-600 bg-blue-50 border-blue-200 focus:ring-blue-500 focus:border-blue-500' :
                          metric.midTermStatus === 'green' ? 'text-emerald-600 bg-emerald-50 border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500' : 
                          'text-slate-400 bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                        } ${readOnly ? 'cursor-default' : ''} ${readOnly && !metric.midTermStatus ? 'bg-slate-50 text-slate-500' : ''}`}
                        value={metric.midTermStatus || ''}
                        disabled={readOnly}
                        onChange={(e) => {
                          if (readOnly || isAssessment) return;
                          const newMetrics = [...metrics];
                          newMetrics[index].midTermStatus = e.target.value as any;
                          setMetrics(newMetrics);
                        }}
                      >
                        <option value="" className="text-slate-400">选择状态</option>
                        <option value="red" className="text-red-600 bg-white">● 严重不符合预期</option>
                        <option value="yellow" className="text-amber-600 bg-white">● 部分不符合预期</option>
                        <option value="blue" className="text-blue-600 bg-white">● 符合预期</option>
                        <option value="green" className="text-emerald-600 bg-white">● 超预期</option>
                      </select>
                      {!readOnly && (
                        <div className={`absolute right-2 top-2 pointer-events-none ${
                          metric.midTermStatus === 'red' ? 'text-red-400' :
                          metric.midTermStatus === 'yellow' ? 'text-amber-400' :
                          metric.midTermStatus === 'blue' ? 'text-blue-400' :
                          metric.midTermStatus === 'green' ? 'text-emerald-400' :
                          'text-slate-400'
                        }`}>
                          <ChevronDown size={12} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-1 py-3 align-top">
                    <div className="relative group h-[70px] flex items-start">
                      <textarea 
                        className={`w-full h-[70px] border rounded p-1.5 ${fontSize} focus:ring-1 outline-none resize-none transition-all duration-200 ${
                          metric.midTermStatus === 'red' ? 'border-red-200 bg-red-50/50 text-red-700 placeholder:text-red-300 focus:ring-red-500 focus:border-red-500' :
                          metric.midTermStatus === 'yellow' ? 'border-amber-200 bg-amber-50/50 text-amber-700 placeholder:text-amber-300 focus:ring-amber-500 focus:border-amber-500' :
                          'border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500'
                        } ${readOnly ? 'cursor-default' : ''} ${readOnly && !metric.midTermStatus ? 'bg-slate-50 text-slate-500' : ''}`} 
                        placeholder={readOnly ? '' : (metric.midTermStatus === 'red' || metric.midTermStatus === 'yellow') ? '必填：请输入差距原因及改进计划' : ''}
                        value={metric.midTermReason || ''}
                        readOnly={readOnly || isAssessment}
                        rows={2}
                        onChange={(e) => {
                          if (readOnly || isAssessment) return;
                          const newMetrics = [...metrics];
                          newMetrics[index].midTermReason = e.target.value;
                          setMetrics(newMetrics);
                        }}
                      />
                    </div>
                  </td>
                </>
              )}
              {isAssessment && (
                <>
                  <td className={`px-1 py-3 align-top ${isApprovalAssessment ? 'w-[18%]' : 'w-[13%]'}`}>
                    <div className="relative group h-[70px] flex items-start">
                      <textarea 
                        className={`w-full h-[70px] border border-slate-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${readOnly || viewMode === 'stakeholder' || isMainBP || currentUserRole === '一级部门负责人' ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`} 
                        placeholder={readOnly || viewMode === 'stakeholder' || isMainBP || currentUserRole === '一级部门负责人' ? '' : "请输入年度完成结果"}
                        value={metric.annualResult || ''}
                        readOnly={readOnly || viewMode === 'stakeholder' || isMainBP || currentUserRole === '一级部门负责人'}
                        rows={2}
                        onChange={(e) => {
                          if (readOnly || viewMode === 'stakeholder' || isMainBP || currentUserRole === '一级部门负责人') return;
                          const newMetrics = [...metrics];
                          newMetrics[index].annualResult = e.target.value;
                          setMetrics(newMetrics);
                        }}
                      />
                    </div>
                  </td>
                  {isApprovalAssessment ? (
                    <>
                      {/* 张三（负责人）自评分 */}
                      <td className="px-1 py-3 align-top">
                        <div className={`h-[70px] border border-slate-200 rounded bg-slate-50 flex items-start justify-start p-1.5 font-bold text-slate-600 ${fontSize}`}>
                          {(metric.selfScore || 0).toFixed(2)}
                        </div>
                      </td>
                      {/* 相关方评分 */}
                      <td className="px-1 py-3 align-top">
                        <div className="space-y-1.5 max-h-[70px] overflow-y-auto pr-1 pt-1.5">
                          {metric.stakeholderScores?.map((s) => (
                            <div key={s.id} className={`flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 ${smallSize}`}>
                              <span className="font-bold text-slate-700">{s.name}</span>
                              <span className="text-slate-400">{s.weight}%</span>
                              <span className="text-blue-600 font-bold ml-auto">{s.score}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      {/* 分管常委/执委评分 */}
                      <td className="px-1 py-3 align-top">
                        <div className="relative h-[70px] flex items-start">
                          <input 
                            type="number"
                            min="0"
                            max="5"
                            step="0.25"
                            className={`w-full h-[70px] border border-blue-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-bold text-blue-600`}
                            value={metric.standingCommitteeScore || 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (isNaN(val)) return;
                              const newMetrics = [...metrics];
                              newMetrics[index].standingCommitteeScore = val;
                              setMetrics(newMetrics);
                            }}
                          />
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      {viewMode === 'stakeholder' && (
                        <td className="px-1 py-3 align-top">
                          <div className={`h-[70px] border border-slate-200 rounded bg-slate-50 flex items-start justify-start p-1.5 font-bold text-slate-600 ${fontSize}`}>
                            {(metric.providerScore || 0).toFixed(2)}
                          </div>
                        </td>
                      )}
                      {viewMode !== 'department' && (
                        <td className="px-1 py-3 align-top">
                          {viewMode === 'stakeholder' ? (
                            <div className="relative h-[70px] flex items-start">
                              <input 
                                type="number"
                                min="0"
                                max="5"
                                step="0.25"
                                className={`w-full h-[70px] border border-blue-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-bold text-blue-600`}
                                value={metric.stakeholderScores?.find(s => s.name === '相关方')?.score ?? (metric.providerScore || 0)}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (isNaN(val)) return;
                                  const newMetrics = [...metrics];
                                  if (!newMetrics[index].stakeholderScores) newMetrics[index].stakeholderScores = [];
                                  const sIndex = newMetrics[index].stakeholderScores!.findIndex(s => s.name === '相关方');
                                  if (sIndex > -1) {
                                    newMetrics[index].stakeholderScores![sIndex].score = val;
                                  } else {
                                    newMetrics[index].stakeholderScores!.push({ id: Math.random().toString(), name: '相关方', score: val, weight: 0 });
                                  }
                                  setMetrics(newMetrics);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="space-y-1 max-h-[70px] overflow-y-auto pr-1 pt-1.5">
                              {metric.stakeholderScores?.map((s) => (
                                <div key={s.id} className={`flex items-center justify-between bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 ${smallSize}`}>
                                  <span className="font-bold text-slate-600">{s.name}</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-blue-600 font-bold">{s.score}</span>
                                    <span className="text-slate-400">({s.weight}%)</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      )}
                      {viewMode !== 'stakeholder' && (
                        <>
                          {!isApprovalAssessment && (
                            <td className="px-1 py-3 align-top">
                              <div className="relative h-[70px] flex items-start">
                                <input 
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="0.25"
                                  className={`w-full h-[70px] border ${isDataProvider ? 'border-blue-200 bg-white' : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'} rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium`}
                                  value={metric.providerScore || 0}
                                  readOnly={!isDataProvider || isMainBP}
                                  onChange={(e) => {
                                    if (!isDataProvider || isMainBP) return;
                                    const val = parseFloat(e.target.value);
                                    if (isNaN(val)) return;
                                    const newMetrics = [...metrics];
                                    newMetrics[index].providerScore = val;
                                    setMetrics(newMetrics);
                                  }}
                                />
                              </div>
                            </td>
                          )}
                          {!isDataProvider && !isMainBP && (
                            <td className="px-1 py-3 align-top">
                              <div className="relative h-[70px] flex items-start">
                                <input 
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="0.25"
                                  className={`w-full h-[70px] border ${viewMode === 'department' && !isMainBP ? 'border-blue-200 bg-white' : 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'} rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium`}
                                  value={metric.selfScore !== undefined ? metric.selfScore : (currentUserRole === '一级部门负责人' ? (metric.providerScore || 0) : 0)}
                                  readOnly={viewMode !== 'department' || isMainBP}
                                  onChange={(e) => {
                                    if (viewMode !== 'department' || isMainBP) return;
                                    const val = parseFloat(e.target.value);
                                    if (isNaN(val)) return;
                                    const newMetrics = [...metrics];
                                    newMetrics[index].selfScore = val;
                                    setMetrics(newMetrics);
                                  }}
                                />
                              </div>
                            </td>
                          )}
                        </>
                      )}
                      {viewMode !== 'stakeholder' && viewMode !== 'department' && (
                        <td className="px-1 py-3 align-top">
                          <div className="relative h-[70px] flex items-start">
                            <input 
                              type="number"
                              min="0"
                              max="5"
                              step="0.25"
                              className={`w-full h-[70px] border border-blue-200 rounded p-1.5 ${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-bold text-blue-600`}
                              value={metric.standingCommitteeScore || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const newMetrics = [...metrics];
                                newMetrics[index].standingCommitteeScore = val;
                                setMetrics(newMetrics);
                              }}
                            />
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </>
              )}
              {!readOnly && !isAssessment && !isMidTerm && (
                <td className="px-1 py-3 align-top">
                  <div className="flex items-start justify-center gap-2 text-slate-400 pt-2">
                    <button onClick={() => handleDeleteMetric(metric.id)} className="hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              )}
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand Textarea Modal */}
      {expandedField && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{expandedField.title}</h3>
              <button 
                onClick={() => setExpandedField(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-hidden flex flex-col min-h-[300px]">
              <textarea
                className={`w-full flex-1 border border-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-base ${readOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                value={metrics.find(m => m.id === expandedField.id)?.[expandedField.field as keyof typeof metrics[0]] as string || ''}
                readOnly={isFieldReadOnly}
                onChange={(e) => {
                  if (isFieldReadOnly) return;
                  const newMetrics = [...metrics];
                  const index = newMetrics.findIndex(m => m.id === expandedField.id);
                  if (index !== -1) {
                    (newMetrics[index] as any)[expandedField.field] = e.target.value;
                    setMetrics(newMetrics);
                  }
                }}
                placeholder={readOnly ? "" : `请输入${expandedField.title}...`}
                autoFocus={!readOnly}
              />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setExpandedField(null)} 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reviewer Selection Modal */}
      <ReviewerModal 
        isOpen={isReviewerModalOpen}
        onClose={() => setIsReviewerModalOpen(false)}
        initialSelected={metrics.find(m => m.id === editingMetricId)?.reviewers || []}
        onConfirm={(selected) => {
          const newMetrics = [...metrics];
          const index = newMetrics.findIndex(m => m.id === editingMetricId);
          if (index !== -1) {
            newMetrics[index].reviewers = selected;
            // Also update legacy fields for compatibility if needed
            if (selected.length > 0) {
              newMetrics[index].reviewer = selected[0].name;
              newMetrics[index].reviewerWeight = selected[0].weight;
            }
            setMetrics(newMetrics);
          }
          setIsReviewerModalOpen(false);
        }}
      />

      
      {/* Provider Selection Modal */}
      <EmployeeModal 
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        initialSelected={metrics.find(m => m.id === editingMetricId)?.providers || []}
        onConfirm={(selected) => {
          const newMetrics = [...metrics];
          const index = newMetrics.findIndex(m => m.id === editingMetricId);
          if (index !== -1) {
            newMetrics[index].providers = selected;
            // Update legacy field
            newMetrics[index].provider = selected.map(p => p.name).join(', ');
            setMetrics(newMetrics);
          }
          setIsProviderModalOpen(false);
        }}
      />
      
      <MetricLibraryModal
        isOpen={isMetricLibraryOpen}
        onClose={() => setIsMetricLibraryOpen(false)}
        onConfirm={handleImportMetrics}
      />
    </div>
  );
}
