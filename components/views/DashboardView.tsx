
import React from 'react';
import { 
  CloudUpload, 
  Bolt, 
  CheckSquare, 
  BarChart3, 
  FileText, 
  Check, 
  Timer, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { FileData, ExamSession } from '../../types';

interface DashboardViewProps {
  onUpload: () => void;
  onStartExam: (file: FileData) => void;
  recentFiles: FileData[];
  recentSessions: ExamSession[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  onUpload, 
  onStartExam, 
  recentFiles, 
  recentSessions 
}) => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-14 py-4">
      {/* Hero Section */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-surface-dark transition-all duration-700 hover:border-primary/30"
        onClick={onUpload}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 md:p-20 min-h-[450px]">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-primary blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="relative size-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-primary/20">
              <CloudUpload size={48} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-4 -right-4 size-10 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/20 animate-bounce">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-white transition-all duration-500">
              Tu IA <span className="text-primary">Exprime</span> cada PDF al Máximo.
            </h1>
            <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Sube tus apuntes y deja que nuestra IA genere exámenes maestros con ilustraciones contextuales y análisis profundo.
            </p>
          </div>

          <button className="mt-12 group/btn relative flex items-center gap-4 px-10 h-16 bg-primary text-white text-xl font-black rounded-2xl shadow-2xl shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95">
            <span>Empezar ahora</span>
            <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Stats/Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Bolt, title: 'Análisis Pro', desc: 'Pensamiento profundo de 24k tokens para no omitir ningún detalle técnico.' },
          { icon: Sparkles, title: 'IA Generativa', desc: 'Imágenes contextuales creadas en tiempo real basadas en tu PDF.' },
          { icon: BarChart3, title: 'Tracking', desc: 'Historial completo de tus sesiones para medir tu evolución real.' }
        ].map((feat, i) => (
          <div key={i} className="bg-surface-dark border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-all group">
            <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 mb-6 group-hover:bg-primary/20 group-hover:text-primary transition-all">
              <feat.icon size={24} />
            </div>
            <h3 className="text-white font-black text-xl mb-2 tracking-tight">{feat.title}</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Mini-table */}
      {recentFiles.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Recientemente cargados</h2>
          </div>
          <div className="bg-surface-dark border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <tbody className="divide-y divide-white/5">
                {recentFiles.slice(0, 5).map((file) => (
                  <tr key={file.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => onStartExam(file)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="size-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/10 group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg leading-none mb-1.5">{file.name}</p>
                          <p className="text-white/20 text-xs font-bold uppercase tracking-widest">{file.size} • PDF</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-primary/10 text-primary text-sm font-black border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                        Generar Test <ArrowRight size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardView;
