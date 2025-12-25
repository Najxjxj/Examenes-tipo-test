
import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  History, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.UPLOAD, label: 'Mis Documentos', icon: FileText },
    { id: View.CONFIG, label: 'Generar Test', icon: BrainCircuit },
    { id: View.HISTORY, label: 'Historial y Progreso', icon: History },
    { id: View.SETTINGS, label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#111a22] border-r border-surface-border flex flex-col shrink-0 z-20 transition-all duration-300">
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="flex gap-3 items-center mb-8 px-2 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <GraduationCap size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold">StudyGen</h1>
              <p className="text-[#92adc9] text-xs">Plan Premium</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-[#92adc9] hover:bg-surface-dark hover:text-white'
                  }`}
                >
                  <Icon size={22} className={isActive ? 'text-primary' : 'group-hover:text-white'} />
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-surface-border">
          <button className="flex w-full items-center gap-3 px-3 py-2 text-[#92adc9] hover:text-white hover:bg-surface-dark rounded-lg transition-colors group">
            <LogOut size={22} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
