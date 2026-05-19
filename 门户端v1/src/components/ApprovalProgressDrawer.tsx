import React from 'react';
import { X, CheckCircle2, Circle, User, Bell } from 'lucide-react';

interface ApprovalProgressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
}

export const ApprovalProgressDrawer: React.FC<ApprovalProgressDrawerProps> = ({ isOpen, onClose, onApprove }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-base font-bold text-slate-800">审批流程进度</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200 z-0"></div>

            {/* Step 1: 发起申请 */}
            <div className="relative z-10 flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 text-sm">发起申请</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">已提交</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-6 h-6 rounded-full border border-slate-200" />
                    <span className="text-sm text-slate-700">张三 (我)</span>
                  </div>
                  <span className="text-xs text-slate-400">2024-07-01 10:30</span>
                </div>
              </div>
            </div>

            {/* Step 2: 直接上级审批 */}
            <div className="relative z-10 flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-blue-600 text-sm">直接上级审批</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">处理中</span>
                </div>
                
                <div className="bg-white border border-blue-100 rounded-lg p-3 shadow-sm shadow-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-6 h-6 rounded-full border border-slate-200" />
                      <span className="text-sm font-medium text-slate-700">王经理</span>
                    </div>
                    <span className="text-xs text-slate-400">审批中</span>
                  </div>
                  <button className="w-full py-2 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-xs font-bold transition-colors mb-2">
                    <Bell size={12} /> 发送催办提醒
                  </button>
                  <button className="w-full py-2 flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-md text-xs transition-colors mb-2">
                    <span className="text-[10px]">[演示]</span> 模拟经理驳回
                  </button>
                  <button 
                    onClick={() => {
                      if (onApprove) onApprove();
                      onClose();
                    }}
                    className="w-full py-2 flex items-center justify-center gap-1.5 border border-emerald-200 hover:bg-emerald-50 text-emerald-600 rounded-md text-xs transition-colors"
                  >
                    <span className="text-[10px]">[演示]</span> 模拟经理同意
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: HR 备案 */}
            <div className="relative z-10 flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-slate-300" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-500 text-sm">HR 备案</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">待处理</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User size={12} className="text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-500">HRBP</span>
                </div>
              </div>
            </div>

            {/* Step 4: 流程结束 */}
            <div className="relative z-10 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-slate-300" />
              </div>
              <div className="flex-1 pt-1.5">
                <span className="font-medium text-slate-500 text-sm">流程结束</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
