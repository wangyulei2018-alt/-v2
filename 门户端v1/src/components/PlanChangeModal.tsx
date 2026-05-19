import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const PlanChangeModal: React.FC<PlanChangeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">绩效计划变更</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            变更理由 <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full h-32 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="请详细填写绩效计划变更的理由..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-white text-sm font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              if (reason.trim()) {
                onSubmit(reason);
                setReason('');
              }
            }}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交计划变更
          </button>
        </div>
      </div>
    </div>
  );
};
