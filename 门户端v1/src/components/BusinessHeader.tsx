import React, { useRef, useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, History, Maximize, Maximize2, Copy, Upload, Clock, ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface BusinessHeaderProps {
  departments: string[];
  activeDept: string;
  setActiveDept: (dept: string) => void;
  activeStep: number;
  totalWeight: number;
  totalMetricsCount?: number;
  isPlanSubmitted?: boolean;
  isPlanApproved?: boolean;
  isPlanChanging?: boolean;
  showTabs?: boolean;
  viewMode?: 'department' | 'executive' | 'stakeholder';
}

export const BusinessHeader: React.FC<BusinessHeaderProps> = ({ 
  departments, 
  activeDept, 
  setActiveDept, 
  activeStep,
  totalWeight,
  totalMetricsCount = 0,
  isPlanSubmitted = false,
  isPlanApproved = false,
  isPlanChanging = false,
  showTabs = true,
  viewMode = 'department'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCycleOpen, setIsCycleOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState('2026年组织绩效考核');
  const cycles = [
    '2026年组织绩效考核',
    '2025年组织绩效考核',
    '2024年组织绩效考核',
    '2026年组织绩效年中评估'
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 100;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isExecutive = viewMode === 'executive';

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0 z-20 relative">
      <div className="max-w-[1400px] mx-auto w-full flex items-center h-full relative">
        {/* Current Assessment Cycle - Moved to left with Dropdown */}
        <div className="flex items-center gap-3 pr-6 mr-6 border-r border-slate-200 h-8 flex-none relative">
          <span className={`${viewMode === 'stakeholder' ? 'text-sm' : viewMode === 'executive' ? 'text-[13px]' : 'text-xs'} text-slate-400 whitespace-nowrap`}>当前考核周期</span>
          <div 
            className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer hover:bg-blue-100/80 transition-all active:scale-95 shadow-sm group"
            onClick={() => setIsCycleOpen(!isCycleOpen)}
          >
            {selectedCycle}
            <ChevronDown size={12} className={`transition-transform duration-300 text-blue-400 group-hover:text-blue-600 ${isCycleOpen ? 'rotate-180' : ''}`} />
          </div>

          {isCycleOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsCycleOpen(false)}
              ></div>
              <div className="absolute top-[calc(100%+8px)] left-0 min-w-[220px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 border-b border-slate-50 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">选择考核周期</span>
                </div>
                {cycles.map(cycle => (
                  <button
                    key={cycle}
                    className={`w-full text-left px-4 py-2 text-[12px] flex items-center justify-between transition-colors ${
                      selectedCycle === cycle ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      setSelectedCycle(cycle);
                      setIsCycleOpen(false);
                    }}
                  >
                    {cycle}
                    {selectedCycle === cycle && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Summary Info - New Section */}
        {viewMode === 'department' && (
          <div className="flex items-center gap-4 pr-6 mr-6 border-r border-slate-200 h-8 flex-none">
            {/* Total weight */}
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-[11px] text-slate-400">总权重之和</span>
              <div className="flex items-baseline gap-0.5">
                <span className={`font-bold text-xs ${totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {totalWeight}
                </span>
                <span className="text-[10px] text-slate-400">%</span>
              </div>
            </div>

            {/* Metrics count */}
            <div className="text-[11px] text-slate-400 whitespace-nowrap">
              共 <span className="font-bold text-slate-600">{totalMetricsCount}</span> 个指标
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              {isPlanApproved ? (
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">
                  已完成
                </div>
              ) : isPlanSubmitted ? (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">
                  审批中
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">
                  待提交
                </div>
              )}
            </div>
          </div>
        )}

        {/* Left Section: Department Tabs */}
        {!isExecutive && (
          <div className="flex-none flex items-center h-full min-w-0">
            {showTabs && (
              <div className="flex items-center h-full mr-6 border-r border-slate-200 pr-4 max-w-[300px]">
                <button 
                  onClick={() => scroll('left')}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div 
                  ref={scrollRef}
                  className="flex items-center h-full overflow-x-auto scrollbar-hide no-scrollbar"
                  style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`h-full px-4 text-sm font-medium transition-all relative flex items-center whitespace-nowrap ${
                        activeDept === dept ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {dept}
                      {activeDept === dept && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => scroll('right')}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex-1"></div>

        {/* Right Section: Icons */}
        <div className={`${isExecutive ? 'flex-none' : 'flex-1'} flex items-center justify-end gap-6 h-full min-w-0`}>
          <div className="flex items-center gap-2.5">
            <button className="w-[30px] h-[30px] flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-full transition-all hover:scale-105 hover:bg-slate-50" title="首页">
              <Home size={15} strokeWidth={2.5} />
            </button>
            {/* Help icon - shown in both entry and approval views */}
            <button className="w-[30px] h-[30px] flex items-center justify-center bg-[#FFFBE6] border border-[#FFE58F] text-[#D46B08] rounded-full transition-all hover:scale-105" title="帮助">
              <HelpCircle size={15} strokeWidth={2.5} />
            </button>
            
            {showTabs && activeStep === 0 && (
              <>
                <button className="w-[30px] h-[30px] flex items-center justify-center bg-white border border-[#E6F4FF] text-[#595959] rounded-full transition-all hover:scale-105 relative" title="评论">
                  <MessageSquare size={15} strokeWidth={2} />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF4D4F] rounded-full border border-white"></div>
                </button>
                <button className="w-[30px] h-[30px] flex items-center justify-center bg-white border border-[#E6F4FF] text-[#595959] rounded-full transition-all hover:scale-105" title="历史版本">
                  <History size={15} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
