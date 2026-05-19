import React, { useState, useMemo } from 'react';
import { X, Search, Check, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUsers: string[]) => void;
}

const mockUsers = [
  { id: '1', name: '李四', dept: '商用出行事业部', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '2', name: '王五', dept: '人力中心', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: '3', name: '张伟', dept: 'SPS事业部', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '4', name: '刘备', dept: '财务中心', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '5', name: '关羽', dept: '供应链中心', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: '6', name: '曹操', dept: '质量中心', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '7', name: '孙权', dept: 'EBIKE事业部', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '8', name: '周瑜', dept: '零极创新事业部', avatar: 'https://i.pravatar.cc/150?img=15' },
];

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => 
      user.name.includes(searchQuery) || user.dept.includes(searchQuery)
    );
  }, [searchQuery]);

  const toggleUser = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
    setSelectedIds([]);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">分享表单</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="搜索姓名或部门..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredUsers.length > 0 ? (
              <div className="space-y-1">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedIds.includes(user.id) 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      {selectedIds.includes(user.id) && (
                        <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{user.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user.dept}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Search size={40} className="mb-2 opacity-20" />
                <p className="text-sm">未找到相关人员</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-xs text-slate-500">
              已选择 <span className="font-bold text-blue-600">{selectedIds.length}</span> 人
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                disabled={selectedIds.length === 0}
                onClick={handleConfirm}
                className={`px-6 py-2 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 ${
                  selectedIds.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                确定分享
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
