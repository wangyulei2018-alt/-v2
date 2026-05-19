import React from 'react';
import { 
  FileSpreadsheet, Library, Settings, Maximize, Maximize2, Copy, Upload, CheckCircle2, XCircle, Download, FileText, Bell, Undo2, ChevronRight, FileEdit,
  Share2
} from 'lucide-react';

interface ActionBarProps {
  activeStep: number;
  isSidebarCollapsed: boolean;
  totalMetricsCount: number;
  totalWeight: number;
  onBatchSetReviewer?: () => void;
  viewMode?: 'department' | 'executive';
  midTermStats?: {
    red: number;
    yellow: number;
    blue: number;
    green: number;
  };
  isPlanSubmitted?: boolean;
  setIsPlanSubmitted?: (submitted: boolean) => void;
  isPlanApproved?: boolean;
  isPlanChanging?: boolean;
  onCancelChange?: () => void;
  onSubmitChange?: () => void;
  onOpenApprovalDrawer?: () => void;
  onPlanChangeClick?: () => void;
  departmentType?: string;
  onAddDimension?: (dimension: string) => void;
  addedDimensions?: string[];
  onShareOpen?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ 
  activeStep, 
  isSidebarCollapsed,
  totalMetricsCount,
  totalWeight,
  onBatchSetReviewer,
  viewMode = 'department',
  midTermStats = { red: 0, yellow: 0, blue: 0, green: 0 },
  isPlanSubmitted = false,
  setIsPlanSubmitted,
  isPlanApproved = false,
  isPlanChanging = false,
  onCancelChange,
  onSubmitChange,
  onOpenApprovalDrawer,
  onPlanChangeClick,
  departmentType,
  onAddDimension,
  addedDimensions = [],
  onShareOpen
}) => {
  const [isAddDimensionOpen, setIsAddDimensionOpen] = React.useState(false);

  return (
    <div className="bg-slate-50/50 backdrop-blur-sm px-6 py-3 border-b border-slate-200 flex-shrink-0 z-10">
      <div className={`mx-auto flex items-center justify-between transition-all duration-300 ${isSidebarCollapsed ? 'max-w-full' : 'max-w-[1400px]'}`}>
        <div className="bg-white rounded-xl h-14 px-4 shadow-sm border border-slate-100 flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-slate-600">
            {activeStep === 0 && (
              <>
                <button className="flex items-center gap-1.5 hover:text-blue-600 text-sm"><FileSpreadsheet size={14} /> Excel导入</button>
                <div className="w-px h-4 bg-slate-200"></div>
              </>
            )}
            {activeStep === 1 && (
              <div className="flex items-center gap-4 mr-2">
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <Library size={16} className="text-slate-400" />
                  <span>共 {totalMetricsCount} 个指标</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-100">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>严重不符合预期: {midTermStats.red}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold border border-amber-100">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>部分不符合预期: {midTermStats.yellow}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>符合预期: {midTermStats.blue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span>超预期: {midTermStats.green}</span>
                  </div>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
              </div>
            )}
            {activeStep === 0 && viewMode === 'department' && (
              <>
                <div className="relative group">
                  <button className="flex items-center gap-1.5 hover:text-blue-600 text-sm">
                    <Download size={14} /> 导出
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                      <FileText size={14} /> 导出 PDF
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                      <FileSpreadsheet size={14} /> 导出 Excel
                    </button>
                  </div>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <button 
                  onClick={onShareOpen}
                  className="flex items-center gap-1.5 hover:text-blue-600 text-sm transition-colors"
                >
                  <Share2 size={14} /> 分享表单
                </button>
                <div className="w-px h-4 bg-slate-200"></div>
              </>
            )}
            <button className="flex items-center gap-1.5 hover:text-blue-600 text-sm"><Maximize size={14} /> 全屏</button>
          </div>
          <div className="flex items-center gap-3">
            {viewMode === 'department' && activeStep === 0 && departmentType === '职能部门/能力中心' && ['能力建设指标', '财务指标', '运营指标'].filter(dim => !addedDimensions.includes(dim)).length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setIsAddDimensionOpen(!isAddDimensionOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                >
                  <span className="text-lg leading-none mb-0.5">+</span> 添加指标维度
                </button>
                {isAddDimensionOpen && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    {['能力建设指标', '财务指标', '运营指标'].filter(dim => !addedDimensions.includes(dim)).map((dim) => (
                      <button
                        key={dim}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        onClick={() => {
                          onAddDimension?.(dim);
                          setIsAddDimensionOpen(false);
                        }}
                      >
                        {dim}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium">
              <Maximize2 size={12} /> 显示完整表单
            </button>
            {viewMode === 'executive' ? (
              <>
                <button className="flex items-center gap-1.5 px-4 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
                  <XCircle size={14} /> 批量退回
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200 transition-all">
                  <CheckCircle2 size={14} /> 批量通过
                </button>
              </>
            ) : (
              <>
                {activeStep === 0 && (
                  <>
                    {isPlanApproved ? (
                      <div className="flex items-center gap-3">
                        {isPlanChanging ? (
                          <>
                            <button 
                              onClick={onCancelChange}
                              className="flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
                            >
                              取消变更
                            </button>
                            <button 
                              onClick={onSubmitChange}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200 transition-colors"
                            >
                              <Upload size={14} /> 提交变更
                            </button>
                          </>
                        ) : (
                          <>
                            <div 
                              className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                              onClick={onOpenApprovalDrawer}
                            >
                              <span className="text-slate-700 font-bold text-sm">查看审批流</span>
                              <ChevronRight size={14} className="text-slate-400" />
                            </div>
                            <button 
                              onClick={onPlanChangeClick}
                              className="flex items-center gap-1.5 px-4 py-1.5 border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 text-sm font-bold transition-colors"
                            >
                              <FileEdit size={14} /> 绩效计划变更
                            </button>
                          </>
                        )}
                      </div>
                    ) : isPlanSubmitted ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-blue-50/50 border border-blue-100 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-bold text-sm">当前审批:</span>
                            <div 
                              className="flex items-center gap-1.5 cursor-pointer hover:bg-blue-100/50 px-1.5 py-0.5 rounded transition-colors"
                              onClick={onOpenApprovalDrawer}
                            >
                              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-5 h-5 rounded-full border border-slate-200" />
                              <span className="text-slate-700 font-bold text-sm">王经理</span>
                              <ChevronRight size={14} className="text-slate-400" />
                            </div>
                          </div>
                          <div className="w-px h-4 bg-blue-200"></div>
                          <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors">
                            <Bell size={14} /> 催办
                          </button>
                        </div>
                        <button 
                          onClick={() => setIsPlanSubmitted && setIsPlanSubmitted(false)}
                          className="flex items-center gap-1.5 px-4 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-bold transition-colors"
                        >
                          <Undo2 size={14} /> 撤回
                        </button>
                      </div>
                    ) : (
                      <>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium">
                          <Copy size={12} /> 保存草稿
                        </button>
                        <button 
                          onClick={() => setIsPlanSubmitted && setIsPlanSubmitted(true)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200"
                        >
                          <Upload size={12} /> 提交绩效计划
                        </button>
                      </>
                    )}
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium">
                      <Copy size={12} /> 保存草稿
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200">
                      <Upload size={12} /> 提交中期回顾
                    </button>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium">
                      <Copy size={12} /> 保存草稿
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200">
                      <Upload size={12} /> 提交绩效评分
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
