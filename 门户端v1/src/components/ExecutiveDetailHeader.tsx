import React, { useState } from 'react';
import { Maximize, Maximize2, XCircle, CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DeptInfo {
  id: string;
  deptName: string;
  deptHead: {
    name: string;
    avatar: string;
  };
  status: string;
}

interface ExecutiveDetailHeaderProps {
  currentDept: DeptInfo;
  allDepts: DeptInfo[];
  onSwitchDept: (dept: DeptInfo) => void;
  onClose: () => void;
  showActions?: boolean;
  isAssessment?: boolean;
  showFullForm?: boolean;
  onToggleFullForm?: () => void;
  currentUserRole?: string;
  activeStep?: number;
}

export const ExecutiveDetailHeader: React.FC<ExecutiveDetailHeaderProps> = ({ 
  currentDept, 
  allDepts, 
  onSwitchDept,
  onClose,
  showActions = true,
  isAssessment = false,
  showFullForm = false,
  onToggleFullForm,
  currentUserRole,
  activeStep
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(allDepts.length - visibleCount, prev + 1));
  };

  const visibleDepts = allDepts.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="bg-white border-b border-slate-200 flex-shrink-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Dept Info */}
        <div className="flex items-center gap-5 min-w-[220px]">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors mr-1"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-slate-800 leading-none">
              {currentDept.deptName}
            </span>
          </div>
          <div className="w-px h-6 bg-slate-100"></div>
          <div className="flex flex-col">
            <div className="leading-none">
              <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[12px] font-bold rounded border border-amber-100">
                {currentDept.status}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Dept Navigation */}
        <div className="flex items-center gap-3 px-6 border-x border-slate-100">
          <button 
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            {visibleDepts.map((dept) => {
              const isActive = dept.id === currentDept.id;
              const shortName = dept.deptName.split('/').pop()?.substring(0, 2) || '';
              
              return (
                <div 
                  key={dept.id}
                  onClick={() => onSwitchDept(dept)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all border-2 ${
                    isActive 
                    ? 'bg-white text-blue-600 border-blue-500 ring-2 ring-blue-50 shadow-sm scale-110 z-10' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:border-blue-300 group-hover:text-blue-500'
                  }`}>
                    {shortName}
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleNext}
            disabled={startIndex >= allDepts.length - visibleCount}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 min-w-[320px] justify-end">
          <div className="flex items-center gap-2 mr-1">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="全屏">
              <Maximize size={18} />
            </button>
            {(showActions || (isAssessment && currentUserRole === '分管常委')) && (
              <button 
                onClick={(currentUserRole === '分管常委' && activeStep === 0) ? undefined : onToggleFullForm}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all text-[14px] font-bold ${
                  (showFullForm || (currentUserRole === '分管常委' && activeStep === 0))
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${(currentUserRole === '分管常委' && activeStep === 0) ? 'cursor-default' : ''}`}
              >
                <Maximize2 size={14} /> {(showFullForm && !(currentUserRole === '分管常委' && activeStep === 0)) ? '收起完整表单' : '显示完整表单'}
              </button>
            )}
          </div>
          {showActions && !isAssessment && (
            <>
              <div className="w-px h-8 bg-slate-200 mr-1"></div>
              <button className="flex items-center gap-2 px-5 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-[14px] font-bold transition-colors">
                <XCircle size={16} /> 退回
              </button>
              <button className="flex items-center gap-5 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[14px] font-bold shadow-md shadow-blue-200 transition-all">
                <CheckCircle2 size={16} /> 通过
              </button>
            </>
          )}
          {isAssessment && (
            <>
              <div className="w-px h-8 bg-slate-200 mr-1"></div>
              <button className="flex items-center gap-2 px-5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-[14px] font-bold transition-colors">
                保存草稿
              </button>
              <button className="flex items-center gap-5 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[14px] font-bold shadow-md shadow-blue-200 transition-all">
                提交绩效评分
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
