import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
  initialSelected?: string[];
}

const departments = [
  '财务部', '市场部', '研发部', '人力资源部', '行政部', '法务部', '供应链部',
  '财务中心', '营销中心', '产品中心', '技术中心', '运营中心'
];

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, onConfirm, initialSelected = [] }) => {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const toggleDept = (dept: string) => {
    if (selected.includes(dept)) {
      setSelected(selected.filter(d => d !== dept));
    } else {
      setSelected([...selected, dept]);
    }
  };

  const filteredDepts = departments.filter(d => d.includes(searchQuery));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[400px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">选择部门</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="搜索部门..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {filteredDepts.map((dept) => (
              <div 
                key={dept}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group"
                onClick={() => toggleDept(dept)}
              >
                <span className={`text-sm ${selected.includes(dept) ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>{dept}</span>
                {selected.includes(dept) && <Check size={16} className="text-blue-600" />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
            取消
          </button>
          <button 
            onClick={() => onConfirm(selected)}
            className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
