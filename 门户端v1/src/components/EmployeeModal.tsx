import React, { useState } from 'react';
import { X, Search, Plus, Check, User } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  title: string;
  empId: string;
  avatar?: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: Employee[]) => void;
  initialSelected?: Employee[];
  title?: string;
}

const mockEmployees: Employee[] = [
  { id: '1', name: '张三', title: '高级研发工程师', empId: 'N1001', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: '王鲍勃', title: '产品经理', empId: 'N9002', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: '戴安娜', title: '销售经理', empId: 'N7004', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: '伊森', title: 'UI设计师', empId: 'N6005', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: '格蕾丝', title: '测试工程师', empId: 'N5007', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: '亨利', title: '运维工程师', empId: 'N4008', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: '张查理', title: '部门经理', empId: 'N1000', avatar: 'https://i.pravatar.cc/150?img=7' },
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onConfirm, initialSelected = [], title = "选择员工" }) => {
  const [selected, setSelected] = useState<Employee[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const toggleEmployee = (employee: Employee) => {
    if (selected.find(e => e.id === employee.id)) {
      setSelected(selected.filter(e => e.id !== employee.id));
    } else {
      setSelected([...selected, employee]);
    }
  };

  const filteredEmployees = mockEmployees.filter(e => 
    e.name.includes(searchQuery) || e.empId.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[500px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="搜索姓名/工号"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group"
                onClick={() => toggleEmployee(employee)}
              >
                <div className="flex items-center gap-3">
                  <img src={employee.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                  <div>
                    <div className={`text-sm font-bold ${selected.find(e => e.id === employee.id) ? 'text-blue-600' : 'text-slate-700'}`}>{employee.name}</div>
                    <div className="text-[11px] text-slate-400">{employee.title} · {employee.empId}</div>
                  </div>
                </div>
                {selected.find(e => e.id === employee.id) && <Check size={16} className="text-blue-600" />}
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
            确定 ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};
