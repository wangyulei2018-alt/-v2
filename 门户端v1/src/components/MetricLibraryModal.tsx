/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight, ChevronLeft, Library } from 'lucide-react';

interface MetricLibraryItem {
  id: string;
  name: string;
  definition: string;
  formula: string;
  source: string;
  category: string;
}

interface MetricLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedMetrics: MetricLibraryItem[]) => void;
}

const CATEGORIES = [
  '全部指标',
  '公司统一指标库',
  '销售部指标库',
  '产研中心指标库',
  '人力资源部指标库'
];

const MOCK_METRICS: MetricLibraryItem[] = [
  { 
    id: '1', 
    name: 'A指标', 
    definition: '通过内部员工推荐成功...', 
    formula: '成功入职', 
    source: 'HR系统',
    category: '人力资源部指标库'
  },
  { 
    id: '2', 
    name: 'B指标', 
    definition: '通过内部员工推荐成功...', 
    formula: '成功入职', 
    source: 'HR系统',
    category: '部门指标库'
  },
  { 
    id: '3', 
    name: 'C指标', 
    definition: '通过内部员工推荐成功...', 
    formula: '成功入职', 
    source: 'HR系统',
    category: '公司统一指标库'
  },
  { 
    id: '4', 
    name: '营收达成率', 
    definition: '实际营收除以目标营收...', 
    formula: '实际完成/目标计划', 
    source: '财务系统',
    category: '公司统一指标库'
  },
  { 
    id: '5', 
    name: '客户满意度', 
    definition: '通过问卷调研获取的...', 
    formula: '满意评分平均值', 
    source: 'CRM系统',
    category: '销售部指标库'
  },
  { 
    id: '6', 
    name: '项目准时交付率', 
    definition: '按期交付项目数占比...', 
    formula: '准时交付数/总交付数', 
    source: 'JIRA系统',
    category: '产研中心指标库'
  },
  { 
    id: '7', 
    name: '人活跃度', 
    definition: '日活用户数...', 
    formula: 'DAU', 
    source: '数据中台',
    category: '公司统一指标库'
  },
  { 
    id: '8', 
    name: '成本控制率', 
    definition: '实际支出与预算比例...', 
    formula: '实际支出/预算额', 
    source: 'ERP系统',
    category: '公司统一指标库'
  }
];

export const MetricLibraryModal: React.FC<MetricLibraryModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部指标');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredMetrics = useMemo(() => {
    return MOCK_METRICS.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = activeCategory === '全部指标' || item.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMetrics.length && filteredMetrics.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMetrics.map(m => m.id)));
    }
  };

  const handleConfirm = () => {
    const selectedList = MOCK_METRICS.filter(m => selectedIds.has(m.id));
    onConfirm(selectedList);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-[1000px] max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Library size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">引用指标库</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-slate-100 bg-slate-50/30 overflow-y-auto py-4">
            <div className="px-5 mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">指标库名称</span>
            </div>
            <div className="space-y-0.5 px-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    activeCategory === cat 
                      ? 'bg-blue-50 text-blue-700 font-bold' 
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[13px]">{cat}</span>
                  {activeCategory === cat && <ChevronRight size={14} className="text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Main List Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden p-6 gap-6">
            {/* Search bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="搜索指标名称"
                className="w-[320px] pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table Area */}
            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={selectedIds.size === filteredMetrics.length && filteredMetrics.length > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-[13px] font-bold text-slate-500 w-12">序号</th>
                      <th className="px-4 py-3 text-[13px] font-bold text-slate-500">指标名称</th>
                      <th className="px-4 py-3 text-[13px] font-bold text-slate-500">指标定义</th>
                      <th className="px-4 py-3 text-[13px] font-bold text-slate-500">计算公式</th>
                      <th className="px-4 py-3 text-[13px] font-bold text-slate-500">数据来源</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMetrics.length > 0 ? (
                      filteredMetrics.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 py-3.5">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={selectedIds.has(item.id)}
                              onChange={() => handleToggleSelect(item.id)}
                            />
                          </td>
                          <td className="px-4 py-3.5 text-[13px] text-slate-600">{idx + 1}</td>
                          <td className="px-4 py-3.5 text-[13px] font-bold text-slate-800">{item.name}</td>
                          <td className="px-4 py-3.5 text-[13px] text-slate-500 max-w-[200px] truncate" title={item.definition}>{item.definition}</td>
                          <td className="px-4 py-3.5 text-[13px] text-slate-500">{item.formula}</td>
                          <td className="px-4 py-3.5 text-[13px] text-slate-500">{item.source}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                               <Search size={24} />
                             </div>
                             <p className="text-slate-400 text-sm">未找到相关指标</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Placeholder */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                <button className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[11px] font-bold">1</span>
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
          <div className="text-[13px] text-slate-400 font-medium">
            已选择 <span className="text-blue-600 font-bold">{selectedIds.size}</span> 项
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-[14px] font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              取消
            </button>
            <button 
              onClick={handleConfirm}
              className="px-8 py-2 rounded-xl text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
              disabled={selectedIds.size === 0}
            >
              确认导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
