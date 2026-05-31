import React from 'react';
import { clsx } from 'clsx';
import { Briefcase, Building2, Stethoscope, Medal, FileText } from 'lucide-react';
import type { ActiveView, ClientId } from '../types';
import { clientsList } from '../mockData';

interface SidebarProps {
  selectedView: ActiveView;
  onSelectView: (view: ActiveView) => void;
}

const getIconForClient = (id: string) => {
  switch (id) {
    case 'web-7': return <Briefcase size={20} />;
    case 'modena': return <Building2 size={20} />;
    case 'six-med': return <Stethoscope size={20} />;
    case 'all-quality': return <Medal size={20} />;
    default: return <Briefcase size={20} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ selectedView, onSelectView }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-xl z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <img src="/logo.png" alt="Web7 Logo" className="w-10 h-10 object-contain rounded-lg bg-white/5 p-1" />
        <h1 className="text-xl font-bold text-white tracking-tight">
          Gestão Ads
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-6">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clientes</p>
          {clientsList.map((client) => (
            <button
              key={client.id}
              onClick={() => onSelectView(client.id as ClientId)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium",
                selectedView === client.id 
                  ? "bg-blue-600/10 text-blue-400 shadow-[inset_4px_0_0_0_#2563eb]" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              {getIconForClient(client.id)}
              {client.name}
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Geral</p>
          <button
            onClick={() => onSelectView('reports-view')}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium",
              selectedView === 'reports-view' 
                ? "bg-blue-600/10 text-blue-400 shadow-[inset_4px_0_0_0_#2563eb]" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <FileText size={20} />
            Relatórios
          </button>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
        &copy; 2026 Agência Web 7
      </div>
    </aside>
  );
};
