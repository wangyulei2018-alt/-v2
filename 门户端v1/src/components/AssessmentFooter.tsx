import React, { useState, useRef, useEffect } from 'react';
import { Metric } from './MetricCard';
import { Calculator, ChevronDown, HelpCircle } from 'lucide-react';

interface AssessmentFooterProps {
  isSidebarCollapsed: boolean;
  fullWidth?: boolean;
  customLabel?: string;
  metrics?: Metric[];
  deptHeadName?: string;
  showCommitteeFields?: boolean;
  hideLabelPrefix?: boolean;
}

export const AssessmentFooter: React.FC<AssessmentFooterProps> = ({ 
  isSidebarCollapsed, 
  fullWidth = false,
  customLabel,
  metrics = [],
  deptHeadName = '张三',
  showCommitteeFields = true,
  hideLabelPrefix = false
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [committeeLevel, setCommitteeLevel] = useState<string | null>(null);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isCommitteeDropdownOpen, setIsCommitteeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const committeeDropdownRef = useRef<HTMLDivElement>(null);
  const grades = ['S', 'A', 'B+', 'B', 'C', 'D'];

  // Calculate total self-assessment score
  const totalSelfScore = metrics.reduce((sum, m) => {
    const score = m.selfScore || 0;
    const weight = m.weight || 0;
    return sum + (score * weight / 100);
  }, 0);

  // Calculate total committee assessment score
  const committeeTotalScore = metrics.reduce((sum, m) => {
    const score = m.standingCommitteeScore || 0;
    const weight = m.weight || 0;
    return sum + (score * weight / 100);
  }, 0);

  // Auto-set self-grade based on score if not set
  useEffect(() => {
    if (!selectedGrade) {
      if (totalSelfScore >= 4.5) setSelectedGrade('A');
      else if (totalSelfScore >= 3.5) setSelectedGrade('B');
      else if (totalSelfScore > 0) setSelectedGrade('C');
    }
  }, [totalSelfScore, selectedGrade]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGradeDropdownOpen(false);
      }
      if (committeeDropdownRef.current && !committeeDropdownRef.current.contains(event.target as Node)) {
        setIsCommitteeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`fixed bottom-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center px-6 z-[110] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 ${
        fullWidth ? 'left-0' : isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-6 max-w-[1400px] w-full">
        {/* Left: Summary Header (Smaller) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
            <Calculator size={16} />
          </div>
          <span className="text-slate-700 font-bold text-sm whitespace-nowrap">评分汇总结果</span>
        </div>

        {/* Right: Cards Container - Right Aligned */}
        <div className="flex items-center gap-3 py-2">
          {/* 1. {Name}（负责人）自评分数 */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2 min-w-[160px] flex items-center justify-between group transition-all hover:bg-blue-100/30">
            <span className="text-[11px] font-bold text-blue-500 whitespace-nowrap">
              {hideLabelPrefix ? '一级部门自评分' : `一级部门自评分`}
            </span>
            <span className="text-xl font-black text-blue-700 tabular-nums leading-none ml-4">
              {totalSelfScore.toFixed(2)}
            </span>
          </div>

          {/* 2. {Name}（负责人）自评等级 */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
              className={`bg-white border rounded-xl px-4 py-2 min-w-[160px] flex items-center justify-between transition-all duration-200 hover:shadow-sm ${
                isGradeDropdownOpen ? 'border-blue-400 ring-4 ring-blue-50' : 'border-blue-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-blue-600 whitespace-nowrap">
                  {hideLabelPrefix ? '一级部门自评等级' : `一级部门自评等级`}
                </span>
                <HelpCircle size={12} className="text-blue-300" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className={`text-xl font-black leading-none ${selectedGrade ? 'text-blue-600' : 'text-slate-300'}`}>
                  {selectedGrade || '-'}
                </span>
                <ChevronDown size={16} className={`text-blue-400 transition-transform duration-200 ${isGradeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isGradeDropdownOpen && (
              <div className="absolute bottom-full mb-3 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-[120]">
                <div className="px-4 py-1.5 border-bottom border-slate-50 mb-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">选择等级</span>
                </div>
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      setSelectedGrade(grade);
                      setIsGradeDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors hover:bg-blue-50 ${
                      selectedGrade === grade ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <span className={`text-sm font-bold ${selectedGrade === grade ? 'text-blue-600' : 'text-slate-600'}`}>{grade} 级</span>
                    {selectedGrade === grade && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {showCommitteeFields && (
            <>
              {/* 3. 分管常委评价分数 */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl px-4 py-2 min-w-[160px] flex items-center justify-between group transition-all hover:bg-amber-100/30">
                <span className="text-[11px] font-bold text-amber-500 whitespace-nowrap">分管常委/执委评价分数</span>
                <span className="text-xl font-black text-amber-700 tabular-nums leading-none ml-4">
                  {committeeTotalScore.toFixed(2)}
                </span>
              </div>

              {/* 4. 分管常委评价等级 */}
              <div className="relative" ref={committeeDropdownRef}>
                <button 
                  onClick={() => setIsCommitteeDropdownOpen(!isCommitteeDropdownOpen)}
                  className={`bg-white border rounded-xl px-4 py-2 min-w-[160px] flex items-center justify-between transition-all duration-200 hover:shadow-sm ${
                    isCommitteeDropdownOpen ? 'border-amber-400 ring-4 ring-amber-50' : 'border-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-600 whitespace-nowrap">
                      分管常委/执委评价等级
                    </span>
                    <HelpCircle size={12} className="text-amber-300" />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xl font-black leading-none ${committeeLevel ? 'text-amber-600' : 'text-slate-300'}`}>
                      {committeeLevel || '-'}
                    </span>
                    <ChevronDown size={16} className={`text-amber-400 transition-transform duration-200 ${isCommitteeDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isCommitteeDropdownOpen && (
                  <div className="absolute bottom-full mb-3 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-[120]">
                    <div className="px-4 py-1.5 border-bottom border-slate-50 mb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">选择评价等级</span>
                    </div>
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => {
                          setCommitteeLevel(grade);
                          setIsCommitteeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors hover:bg-amber-50 ${
                          committeeLevel === grade ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <span className={`text-sm font-bold ${committeeLevel === grade ? 'text-amber-600' : 'text-slate-600'}`}>{grade} 级</span>
                        {committeeLevel === grade && <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
