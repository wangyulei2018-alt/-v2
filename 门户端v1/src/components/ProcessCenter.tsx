import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronRight, ChevronLeft, ChevronDown, RotateCcw, Play } from 'lucide-react';

interface ProcessTask {
  id: string;
  status: string;
  type: string;
  subject: string;
  initiator: string;
  initiationTime: string;
  currentHandler: string;
}

const mockTasks: ProcessTask[] = [
  { id: '1', status: '待处理', type: '组织绩效', subject: '财务中心绩效计划制定填写', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-20 10:00:00', currentHandler: '张三 (N1001)' },
  { id: '2', status: '待处理', type: '组织绩效', subject: '财务中心绩效计划制定审批', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-20 11:30:00', currentHandler: '张三 (N1001)' },
  { id: '3', status: '待处理', type: '组织绩效', subject: '商用出行事业部绩效中期回顾填写', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-21 09:15:00', currentHandler: '张三 (N1001)' },
  { id: '4', status: '待处理', type: '组织绩效', subject: '商用出行事业部绩效中期回顾审批', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-21 14:20:00', currentHandler: '张三 (N1001)' },
  { id: '5', status: '待处理', type: '组织绩效', subject: 'EBIKE事业部绩效预考核数据填报', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-22 08:45:00', currentHandler: '张三 (N1001)' },
  { id: '6', status: '待处理', type: '组织绩效', subject: 'EBIKE事业部绩效预考核评分', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-22 13:10:00', currentHandler: '张三 (N1001)' },
  { id: '7', status: '待处理', type: '组织绩效', subject: '供应链中心绩效考核数据填报', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-23 09:00:00', currentHandler: '张三 (N1001)' },
  { id: '8', status: '待处理', type: '组织绩效', subject: '供应链中心绩效考核评分', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-03-23 10:30:00', currentHandler: '张三 (N1001)' },
  { id: '9', status: '待处理', type: '调薪奖金', subject: '发送奖金结果审批通知预警', initiator: 'HR租户管理员 (boogoo)', initiationTime: '2024-02-09 11:00:04', currentHandler: '测试2 (90000002)' },
  { id: '10', status: '待处理', type: '组织与人才盘点', subject: '集团人力行政中心/员工关系部二盘三盘点报告审批', initiator: '测试6001 (90010244)', initiationTime: '2024-01-08 16:31:15', currentHandler: '测试2 (90000002)' },
];

export const ProcessCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todo');
  const [subjectSearch, setSubjectSearch] = useState('');

  const tabs = [
    { id: 'todo', label: '待办(28)' },
    { id: 'done', label: '已办(40)' },
    { id: 'cc', label: '抄送(0)' },
    { id: 'mine', label: '我发起(0)' },
    { id: 'finance', label: '财务共享(0)' },
    { id: 'draft', label: '草稿(0)' },
    { id: 'unread', label: '流程待阅(0)' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-6">流程中心</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white w-64">
              <input type="text" placeholder="开始日期" className="w-full text-xs outline-none" />
              <span className="text-slate-300">→</span>
              <input type="text" placeholder="结束日期" className="w-full text-xs outline-none" />
              <Calendar size={14} className="text-slate-400" />
            </div>
            
            <div className="relative w-48">
              <input 
                type="text" 
                placeholder="流程主题" 
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
              />
            </div>

            <div className="relative w-48">
              <div className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer bg-white">
                <span className="text-slate-400">流程类型</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button className="flex items-center gap-1 text-slate-500 text-xs hover:text-slate-700">
                <RotateCcw size={14} /> 重置
              </button>
              <button className="flex items-center gap-1 text-slate-500 text-xs hover:text-slate-700 font-medium">
                <Search size={14} /> 查询
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-slate-100 px-4 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4 border-b border-slate-100">流程状态</th>
                  <th className="px-6 py-4 border-b border-slate-100">流程类型</th>
                  <th className="px-6 py-4 border-b border-slate-100">流程主题</th>
                  <th className="px-6 py-4 border-b border-slate-100">发起人</th>
                  <th className="px-6 py-4 border-b border-slate-100">发起时间</th>
                  <th className="px-6 py-4 border-b border-slate-100">当前处理人</th>
                  <th className="px-6 py-4 border-b border-slate-100 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                        <span className="text-xs font-bold text-slate-700">{task.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 font-medium">{task.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-700 font-bold max-w-md truncate">{task.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{task.initiator}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-mono">{task.initiationTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{task.currentHandler}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-500 font-bold text-xs hover:text-red-600 transition-colors">
                        去处理
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30 gap-4">
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
                <ChevronLeft size={14} />
              </button>
              <div className="w-7 h-7 flex items-center justify-center bg-black text-white rounded-lg text-xs font-bold shadow-sm">1</div>
              <div className="w-7 h-7 flex items-center justify-center hover:bg-white text-slate-500 rounded-lg text-xs font-bold cursor-pointer">2</div>
              <div className="w-7 h-7 flex items-center justify-center hover:bg-white text-slate-500 rounded-lg text-xs font-bold cursor-pointer">3</div>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-white text-[11px] font-bold text-slate-600">
              10 / 页 <ChevronDown size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
