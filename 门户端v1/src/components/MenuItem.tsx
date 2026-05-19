import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active = false, isCollapsed = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer mb-1 ${active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700 hover:bg-slate-50'} ${isCollapsed ? 'justify-center' : 'gap-3'}`}
      title={isCollapsed ? label : undefined}
    >
      <div className={active ? 'text-blue-600' : 'text-slate-500'}>{icon}</div>
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
};
