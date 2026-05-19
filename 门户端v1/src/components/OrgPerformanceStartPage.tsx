import React, { useState } from 'react';
import { BookOpen, MonitorPlay, FileText, ChevronRight, FileSpreadsheet, Target } from 'lucide-react';

interface OrgPerformanceStartPageProps {
  onStart: () => void;
}

export const OrgPerformanceStartPage: React.FC<OrgPerformanceStartPageProps> = ({ onStart }) => {
  const [isRead, setIsRead] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto flex gap-6 h-full">
          {/* Left Panel: Timeline & Info */}
          <div className="w-[40%] bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">2026年组织绩效计划启动说明</h1>
            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-8 w-fit">
              2026.01.28 - 2026.03.13
            </div>

            {/* Timeline UI */}
            <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-slate-700 mb-12 text-center">整体安排：2026年组织绩效计划将于<span className="text-red-600">1月28日</span>启动，<span className="text-red-600">3月13日</span>完成。</h3>
                
                <div className="relative px-4">
                    {/* Timeline Line */}
                    <div className="absolute top-3 left-8 right-8 border-t-2 border-dashed border-slate-300"></div>
                    
                    {/* Timeline Points */}
                    <div className="relative flex justify-between">
                        {/* Point 1 */}
                        <div className="flex flex-col items-center w-1/3 relative">
                            <div className="absolute -top-8 text-xs font-bold text-blue-600">1.28 启动</div>
                            <div className="w-6 h-6 rounded-full bg-red-600 border-4 border-white shadow-sm z-10 mb-4"></div>
                            <div className="text-center w-full px-2">
                                <div className="text-xs text-slate-600 bg-white px-3 py-3 rounded-lg border border-slate-200 shadow-sm relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-100 rounded-full border border-slate-200 text-[10px] flex items-center justify-center text-slate-500 font-bold">1</div>
                                    <div className="mt-1">一级部门和相关方、分管常委<br/>共识形成计划（线上文档）</div>
                                </div>
                            </div>
                        </div>

                        {/* Point 2 */}
                        <div className="flex flex-col items-center w-1/3 relative">
                            <div className="absolute -top-8 text-xs font-bold text-red-500 flex gap-4">
                                <span>2.14</span>
                                <span>2.24</span>
                            </div>
                            <div className="absolute -top-4 text-xs text-slate-400">春节</div>
                            <div className="flex gap-4 z-10 mb-4">
                                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-red-400 shadow-sm"></div>
                                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-red-400 shadow-sm"></div>
                            </div>
                            <div className="text-center w-full px-2 mt-2">
                                <div className="text-xs text-slate-600 bg-white px-3 py-3 rounded-lg border border-slate-200 shadow-sm relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-100 rounded-full border border-slate-200 text-[10px] flex items-center justify-center text-slate-500 font-bold">2</div>
                                    <div className="mt-1">集团<br/>组织通晒会</div>
                                </div>
                            </div>
                        </div>

                        {/* Point 3 */}
                        <div className="flex flex-col items-center w-1/3 relative">
                            <div className="absolute -top-8 text-xs font-bold text-red-600 flex justify-between w-full px-4">
                                <span>3.6</span>
                                <span>3.13</span>
                            </div>
                            <div className="flex justify-between w-full px-4 z-10 mb-4">
                                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-red-600 shadow-sm"></div>
                                <div className="w-6 h-6 rounded-full bg-red-600 border-4 border-white shadow-sm -mt-1"></div>
                            </div>
                            <div className="text-center w-full px-2 mt-2">
                                <div className="text-xs text-slate-600 bg-white px-3 py-3 rounded-lg border border-slate-200 shadow-sm relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-100 rounded-full border border-slate-200 text-[10px] flex items-center justify-center text-slate-500 font-bold">3</div>
                                    <div className="mt-1">一级部门系统填报<br/>分管常委完成审批</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Panel: Modules & Files */}
          <div className="w-[60%] flex flex-col gap-4 h-full">
            {/* Module 1 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-800">制度政策</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <FileText size={16} className="text-red-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">《组织绩效管理制度2.0》.pdf</div>
                    <div className="text-xs text-slate-400">2.4 MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex-[2]">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-800">计划制定</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <FileText size={16} className="text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">《2026年组织绩效计划模版》.docx</div>
                    <div className="text-xs text-slate-400">1.2 MB</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <FileSpreadsheet size={16} className="text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">《2026年组织绩效计划指标库1.0》.xlsx</div>
                    <div className="text-xs text-slate-400">3.5 MB</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <FileSpreadsheet size={16} className="text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">《2026年组织绩效计划通晒汇总》.xlsx</div>
                    <div className="text-xs text-slate-400">1.8 MB</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <FileSpreadsheet size={16} className="text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">《2026年组织绩效计划通晒排期表》.xlsx</div>
                    <div className="text-xs text-slate-400">0.9 MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <MonitorPlay size={18} className="text-purple-600" />
                <h3 className="font-bold text-slate-800">系统操作</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <FileText size={16} className="text-red-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">《组织绩效系统填写操作手册》.pdf</div>
                    <div className="text-xs text-slate-400">5.1 MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-slate-200 p-4 px-8 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isRead ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
            {isRead && <div className="w-2 h-2 bg-white rounded-full"></div>}
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isRead}
            onChange={(e) => setIsRead(e.target.checked)}
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">我已阅读并理解相关制度理念&系统操作</span>
        </label>

        <button 
          onClick={onStart}
          disabled={!isRead}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            isRead 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          开启绩效计划 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
