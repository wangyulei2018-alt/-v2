import React, { useState } from 'react';
import { Search, Filter, ChevronRight, Clock, ChevronLeft, CheckCircle2, XCircle, Info } from 'lucide-react';

interface ExecutiveTask {
  id: string;
  deptName: string;
  deptHead: {
    name: string;
    avatar: string;
  };
  hrbp: {
    name: string;
    avatar: string;
  };
  status: string;
  arrivalTime: string;
  stayDuration: string;
}

export const ExecutivePerformance: React.FC<{ 
  tasks: ExecutiveTask[],
  onGoToApproval: (task: ExecutiveTask) => void,
  activeStep: number
}> = ({ tasks, onGoToApproval, activeStep }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isMidTerm = activeStep === 1;
  const tabs = [
    { id: 'pending', label: isMidTerm ? '进行中' : '待审批', count: 3 },
    { id: 'unsubmitted', label: isMidTerm ? '未开始' : '未提交', count: 2 },
    { id: 'approved', label: isMidTerm ? '已完成' : '已审批', count: 12 },
    { id: 'all', label: '全部部门', count: 17 }
  ];

  const filteredTasks = tasks.filter(task => 
    task.deptName.includes(searchQuery) || 
    task.deptHead.name.includes(searchQuery)
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isBatchActive = selectedIds.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto">
        {/* Info Banner for Mid-term Review */}
        {isMidTerm && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-blue-700 shadow-sm">
            <div className="mt-0.5">
              <Info size={18} className="text-blue-500" />
            </div>
            <p className="text-[14px] leading-relaxed">
              <span className="font-bold text-blue-800">业务提示：</span> 中期回顾阶段侧重于目标对齐与业务复盘，<span className="text-blue-900 font-bold underline decoration-blue-300 underline-offset-4">无需审批</span>。您可在此实时查阅分管部门的回顾进度与内容，确保年度目标稳步推进。
            </p>
          </div>
        )}

        {/* Tabs & Batch Actions Row */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-200">
          <div className="flex items-center gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 text-[15px] font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span className="ml-1 opacity-60 text-[11px]">({tab.count})</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {!isMidTerm && (
            <div className="flex items-center gap-2 pb-2">
              <button 
                disabled={!isBatchActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[12px] font-bold transition-all ${
                  isBatchActive 
                  ? 'border-red-200 text-red-600 hover:bg-red-50' 
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <XCircle size={14} /> 批量退回
              </button>
              <button 
                disabled={!isBatchActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  isBatchActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 size={14} /> 批量通过
              </button>
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-[12px] font-bold px-2 uppercase tracking-wider">
              <Filter size={14} />
              <span>筛选:</span>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="按部门名称/部门负责人搜索..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[13px] uppercase tracking-wider font-bold">
                  <th className="w-12 px-6 py-3 border-b border-slate-100">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.length === filteredTasks.length && filteredTasks.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 border-b border-slate-100">部门名称</th>
                  <th className="px-6 py-3 border-b border-slate-100">部门负责人</th>
                  <th className="px-6 py-3 border-b border-slate-100">主HRBP</th>
                  <th className="px-6 py-3 border-b border-slate-100">状态</th>
                  <th className="px-6 py-3 border-b border-slate-100">到达时间</th>
                  <th className="px-6 py-3 border-b border-slate-100">停留时长</th>
                  <th className="px-6 py-3 border-b border-slate-100 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(task.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(task.id)}
                        onChange={() => toggleSelect(task.id)}
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-[15px] text-slate-600 font-medium">{task.deptName}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={task.deptHead.avatar} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                        <div className="text-[15px] font-bold text-slate-700">{task.deptHead.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={task.hrbp.avatar} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                        <div className="text-[15px] font-bold text-slate-700">{task.hrbp.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[12px] font-bold rounded border border-amber-100">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-[13px] text-slate-500">{task.arrivalTime}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded w-fit">
                        <Clock size={10} className="text-slate-400" />
                        <span className="text-[12px] font-bold text-slate-600">{task.stayDuration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => onGoToApproval(task)}
                        className="inline-flex items-center gap-0.5 text-blue-600 font-bold text-[14px] hover:text-blue-700 transition-colors"
                      >
                        {isMidTerm ? '看进展' : '去审批'}
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="text-xs text-slate-400 font-medium">
              共 {filteredTasks.length} 条
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
                <ChevronLeft size={16} />
              </button>
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">1</div>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
