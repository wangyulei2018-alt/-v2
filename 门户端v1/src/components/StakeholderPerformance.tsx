import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronRight, Clock, MessageSquare, ChevronLeft, ChevronDown } from 'lucide-react';

interface StakeholderTask {
  id: string;
  deptName: string;
  deptHead: {
    name: string;
    empId: string;
    avatar: string;
  };
  hbrp: {
    name: string;
    empId: string;
  };
  status: string;
  cycle: string;
  stage: '组织绩效计划制定' | '组织绩效考核';
  arrivalTime: string;
  stayDuration: string;
}

const mockTasks: StakeholderTask[] = [
  {
    id: '1',
    deptName: '商用出行事业部',
    deptHead: { name: '李四', empId: 'N2001', avatar: 'https://i.pravatar.cc/150?img=4' },
    hbrp: { name: '王五', empId: 'H1001' },
    status: '待审批',
    cycle: '2024 H2',
    stage: '组织绩效计划制定',
    arrivalTime: '2024-07-28 10:30',
    stayDuration: '27天4小时'
  },
  {
    id: '2',
    deptName: 'EBIKE事业部',
    deptHead: { name: '王五', empId: 'N3002', avatar: 'https://i.pravatar.cc/150?img=5' },
    hbrp: { name: '赵六', empId: 'H1002' },
    status: '待审批',
    cycle: '2024 H2',
    stage: '组织绩效考核',
    arrivalTime: '2024-07-28 10:30',
    stayDuration: '25天4小时'
  },
  {
    id: '3',
    deptName: 'SPS事业部',
    deptHead: { name: '张伟', empId: 'N4003', avatar: 'https://i.pravatar.cc/150?img=6' },
    hbrp: { name: '孙七', empId: 'H1003' },
    status: '待审批',
    cycle: '2024 H2',
    stage: '组织绩效考核',
    arrivalTime: '2024-07-28 10:30',
    stayDuration: '20天4小时'
  }
];

interface StakeholderPerformanceProps {
  onGoToApproval: (task: StakeholderTask) => void;
}

export const StakeholderPerformance: React.FC<StakeholderPerformanceProps> = ({ onGoToApproval }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = mockTasks.filter(task => 
    task.deptName.includes(searchQuery) || 
    task.deptHead.name.includes(searchQuery) || 
    task.deptHead.empId.includes(searchQuery)
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <MessageSquare size={16} />
            </div>
            <h1 className="text-[16px] font-bold text-slate-800">相关方部门绩效</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[12px] font-medium text-slate-600">当前考核周期</span>
            <span className="text-[12px] font-bold text-blue-600 ml-1">2024 H1</span>
            <ChevronDown size={12} className="text-slate-400 ml-0.5" />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-100 px-6">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 text-[14px] font-bold transition-all relative ${activeTab === 'pending' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              待审批 <span className="ml-1 opacity-60 text-[11px]">(3)</span>
              {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-3 text-[14px] font-bold transition-all relative ${activeTab === 'approved' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              已审批 <span className="ml-1 opacity-60 text-[11px]">(1)</span>
              {activeTab === 'approved' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 text-[14px] font-bold transition-all relative ${activeTab === 'all' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              全部任务
              {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
            </button>
          </div>

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
                placeholder="搜索部门/部门负责人/工号..."
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
                <tr className="bg-slate-50/50 text-slate-500 text-[12px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-3 border-b border-slate-100">部门名称</th>
                  <th className="px-6 py-3 border-b border-slate-100">部门负责人</th>
                  <th className="px-6 py-3 border-b border-slate-100">主HBRP</th>
                  <th className="px-6 py-3 border-b border-slate-100">活动阶段</th>
                  <th className="px-6 py-3 border-b border-slate-100">到达时间</th>
                  <th className="px-6 py-3 border-b border-slate-100">停留时长</th>
                  <th className="px-6 py-3 border-b border-slate-100 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="text-[14px] text-slate-600 font-medium">{task.deptName}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={task.deptHead.avatar} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                        <div>
                          <div className="text-[14px] font-bold text-slate-700">{task.deptHead.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div>
                        <div className="text-[14px] font-bold text-slate-700">{task.hbrp.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          task.stage === '组织绩效计划制定' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}></div>
                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                          task.stage === '组织绩效计划制定' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {task.stage}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-[12px] text-slate-500">{task.arrivalTime}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded w-fit">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[12px] font-bold text-slate-600">{task.stayDuration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => onGoToApproval(task)}
                        className="inline-flex items-center gap-0.5 text-blue-600 font-bold text-[13px] hover:text-blue-700 transition-colors"
                      >
                        {task.stage === '组织绩效计划制定' ? '去审批' : '去评分'}
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
              <span className="mx-4">每页 10 条</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
                <ChevronLeft size={16} />
              </button>
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">1</div>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
                <ChevronRight size={16} />
              </button>
              <span className="text-xs text-slate-400 ml-2">1 / 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
