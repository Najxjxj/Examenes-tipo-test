
import React from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Trash2, 
  Info,
  Camera,
  LogOut
} from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Configuración de Cuenta</h1>
        <p className="text-[#92adc9] text-lg">Gestiona tu información personal, seguridad y preferencias de la aplicación.</p>
      </div>

      <div className="bg-surface-dark rounded-2xl border border-surface-border shadow-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 md:p-10 border-b border-surface-border">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="relative group">
                <div 
                  className="size-24 md:size-32 rounded-full border-4 border-surface-border bg-center bg-cover"
                  style={{ backgroundImage: 'url("https://picsum.photos/300")' }}
                ></div>
                <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </button>
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-white">Juan Pérez</h3>
                <p className="text-[#92adc9] max-w-xs mt-1">PNG, JPG hasta 5MB. Se recomienda una imagen cuadrada.</p>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">Cambiar Foto</button>
                  <button className="px-4 py-2 bg-surface-border text-slate-300 text-xs font-bold rounded-lg">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Nombre Completo</label>
            <input 
              type="text" 
              defaultValue="Juan Pérez" 
              className="w-full h-12 rounded-xl bg-background-dark border-surface-border text-white focus:border-primary px-4"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Correo Electrónico</label>
            <input 
              type="email" 
              defaultValue="juan.perez@estudiante.com" 
              className="w-full h-12 rounded-xl bg-background-dark border-surface-border text-white focus:border-primary px-4"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-300">Biografía</label>
            <textarea 
              rows={4}
              placeholder="Cuéntanos un poco sobre tus objetivos de estudio..." 
              className="w-full rounded-xl bg-background-dark border-surface-border text-white focus:border-primary p-4 resize-none"
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-background-dark/30 flex justify-end gap-4 border-t border-surface-border">
          <button className="px-6 py-2 text-[#637588] hover:text-white font-bold transition-all">Cancelar</button>
          <button className="px-8 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">Guardar Cambios</button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-surface-dark rounded-2xl border border-surface-border shadow-2xl overflow-hidden">
        <div className="px-8 py-5 border-b border-surface-border flex items-center gap-3">
          <Lock size={20} className="text-primary" />
          <h3 className="text-lg font-bold text-white">Seguridad</h3>
        </div>
        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Contraseña Actual</label>
            <input type="password" placeholder="••••••••" className="w-full h-12 rounded-xl bg-background-dark border-surface-border text-white focus:border-primary px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Nueva Contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full h-12 rounded-xl bg-background-dark border-surface-border text-white focus:border-primary px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Confirmar</label>
            <input type="password" placeholder="••••••••" className="w-full h-12 rounded-xl bg-background-dark border-surface-border text-white focus:border-primary px-4" />
          </div>
        </div>
        <div className="px-8 py-4 bg-primary/5 border-t border-surface-border">
           <button className="text-primary text-sm font-bold hover:underline">Actualizar Contraseña</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-danger/5 rounded-2xl border border-danger/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-danger/10 text-danger rounded-xl"><Trash2 size={24} /></div>
          <div>
            <h3 className="text-white font-black text-xl mb-1">Zona de Peligro</h3>
            <p className="text-slate-400 text-sm max-w-md">Eliminar tu cuenta es una acción irreversible. Perderás todos tus documentos y progreso.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 rounded-xl font-black transition-all">
          Eliminar Cuenta
        </button>
      </div>

      <div className="h-10"></div>
    </div>
  );
};

export default SettingsView;
