import React, { useState } from 'react';
import { X, Search, Plus, Trash2, AlertCircle, User } from 'lucide-react';

interface Reviewer {
  id: string;
  name: string;
  title: string;
  empId: string;
  avatar?: string;
  isManager?: boolean;
}

interface SelectedReviewer extends Reviewer {
  weight: number;
}

interface ReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: SelectedReviewer[]) => void;
  initialSelected?: SelectedReviewer[];
}

const mockReviewers: Reviewer[] = [
  { id: '1', name: '张三', title: '高级研发工程师', empId: 'N1001', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: '王鲍勃', title: '产品经理', empId: 'N9002', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: '戴安娜', title: '销售经理', empId: 'N7004', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: '伊森', title: 'UI设计师', empId: 'N6005', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: '格蕾丝', title: '测试工程师', empId: 'N5007', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: '亨利', title: '运维工程师', empId: 'N4008', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: '张查理', title: '部门经理', empId: 'N1000', isManager: true, avatar: 'https://i.pravatar.cc/150?img=7' },
];

export const ReviewerModal: React.FC<ReviewerModalProps> = ({ isOpen, onClose, onConfirm, initialSelected = [] }) => {
  const [selected, setSelected] = useState<SelectedReviewer[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const totalWeight = selected.reduce((sum, r) => sum + r.weight, 0);

  const handleAdd = (reviewer: Reviewer) => {
    if (selected.find(r => r.id === reviewer.id)) return;
    setSelected([...selected, { ...reviewer, weight: 0 }]);
  };

  const handleRemove = (id: string) => {
    setSelected(selected.filter(r => r.id !== id));
  };

  const handleWeightChange = (id: string, weight: number) => {
    setSelected(selected.map(r => r.id === id ? { ...r, weight } : r));
  };

  const filteredReviewers = mockReviewers.filter(r => 
    r.name.includes(searchQuery) || r.empId.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[800px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">选择考核人</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden h-[500px]">
          {/* Left Side: Selection */}
          <div className="w-1/2 border-r border-slate-100 flex flex-col p-4 bg-slate-50/30">
            <div className="text-sm font-bold text-slate-700 mb-3 px-1">待选考核人</div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="搜索姓名/工号"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1 pr-2">
              {filteredReviewers.map((reviewer) => (
                <div 
                  key={reviewer.id}
                  className="flex items-center justify-between p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group cursor-pointer"
                  onClick={() => handleAdd(reviewer)}
                >
                  <div className="flex items-center gap-3">
                    <img src={reviewer.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                    <div>
                      <div className="text-sm font-bold text-slate-700">{reviewer.name}</div>
                      <div className="text-[11px] text-slate-400">{reviewer.title} · {reviewer.empId}</div>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-300 group-hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Selected */}
          <div className="w-1/2 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="text-sm font-bold text-slate-700">已选考核人 ({selected.length})</div>
              <div className={`text-sm font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-amber-500'}`}>
                总权重：{totalWeight}%
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {selected.map((reviewer) => (
                <div key={reviewer.id} className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    {reviewer.avatar ? (
                      <img src={reviewer.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{reviewer.name}</span>
                        {reviewer.isManager && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">上级</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">{reviewer.title} · {reviewer.empId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="w-12 h-8 text-center border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={reviewer.weight}
                        onChange={(e) => handleWeightChange(reviewer.id, parseInt(e.target.value) || 0)}
                      />
                      <span className="text-slate-400 text-xs">%</span>
                    </div>
                    <button 
                      onClick={() => handleRemove(reviewer.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {selected.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <User size={48} strokeWidth={1} />
                  <div className="text-sm">暂未选择考核人</div>
                </div>
              )}
            </div>

            {totalWeight !== 100 && selected.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-amber-600 text-xs font-medium">
                <AlertCircle size={14} />
                <span>注意：当前总权重为 {totalWeight}%，请调整至 100%。</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => onConfirm(selected)}
            disabled={totalWeight !== 100 && selected.length > 0}
            className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            确认配置
          </button>
        </div>
      </div>
    </div>
  );
};
