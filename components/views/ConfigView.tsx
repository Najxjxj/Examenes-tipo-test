
import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Settings2, 
  BrainCircuit, 
  CheckCircle, 
  Timer, 
  GraduationCap,
  Sparkles,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { FileData, ExamSession, QuestionType, StudyMode } from '../../types';
import { generateQuestions, generateTopicImage } from '../../services/geminiService';

interface ConfigViewProps {
  files: FileData[];
  referenceText?: string;
  onGenerate: (session: ExamSession) => void;
}

const ConfigView: React.FC<ConfigViewProps> = ({ files, referenceText, onGenerate }) => {
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.id || '');
  const [type, setType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<StudyMode>(StudyMode.PRACTICE);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerate = async () => {
    const file = files.find(f => f.id === selectedFileId);
    if (!file) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    setLoading(true);
    try {
      setLoadingStep('Analizando PDF y contexto de referencia...');
      const questions = await generateQuestions(file, count, type, referenceText);
      
      setLoadingStep('Generando identidad visual del tema...');
      const coverImage = await generateTopicImage(file.name);

      const newSession: ExamSession = {
        id: Date.now().toString(),
        title: `Test Maestro: ${file.name}`,
        topic: file.name,
        date: new Date().toLocaleDateString('es-ES'),
        score: 0,
        totalQuestions: questions.length,
        questions,
        mode,
        coverImage
      };
      onGenerate(newSession);
    } catch (error) {
      console.error(error);
      alert("Error al exprimir el PDF. Intenta con un número menor de preguntas o verifica el archivo.");
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Configuración de nuevo test</h1>
        <p className="text-[#92adc9] text-lg">Personaliza el nivel de profundidad de tu examen.</p>
        {referenceText && (
          <div className="mt-2 flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest bg-primary/10 w-fit px-3 py-1 rounded-lg">
            <Sparkles size={12} /> Contexto de referencia activado
          </div>
        )}
      </div>

      <div className="bg-surface-dark p-6 md:p-10 rounded-2xl border border-surface-border shadow-2xl space-y-10">
        <div className="flex flex-col gap-4">
          <label className="text-white text-base font-bold flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 text-primary rounded-md"><FileText size={18} /></div>
            Documento base
          </label>
          <div className="relative group">
            <select 
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="w-full h-14 pl-5 pr-12 rounded-xl bg-background-dark border border-surface-border text-white text-lg focus:border-primary appearance-none cursor-pointer transition-all"
            >
              {files.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <label className="text-white text-base font-bold flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 text-primary rounded-md"><Settings2 size={18} /></div>
              Profundidad del examen
            </label>
            <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-black border border-primary/20">{count} preguntas</span>
          </div>
          <div className="px-2">
            <input 
              type="range" min="3" max="50" step="1" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-2 bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span>Básico</span>
              <span>Medio</span>
              <span>Exhaustivo</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-white text-base font-bold flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 text-primary rounded-md"><HelpCircle size={18} /></div>
            Tipo de preguntas
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: QuestionType.MULTIPLE_CHOICE, label: 'Múltiple Choice', icon: BrainCircuit },
              { id: QuestionType.TRUE_FALSE, label: 'V / F', icon: CheckCircle },
              { id: QuestionType.MIXED, label: 'Mixto', icon: Sparkles },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setType(opt.id as QuestionType)}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all active:scale-95 ${
                  type === opt.id 
                    ? 'border-primary bg-primary/10 text-white shadow-lg' 
                    : 'border-surface-border bg-background-dark/50 text-[#92adc9] hover:bg-surface-border/20'
                }`}
              >
                <opt.icon size={32} />
                <span className="font-bold text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button 
          onClick={handleGenerate}
          disabled={loading || !selectedFileId}
          className="w-full md:w-auto min-w-[280px] h-16 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xl font-black rounded-2xl shadow-2xl transition-all flex flex-col items-center justify-center group active:scale-95"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={24} />
                <span>Eximiendo PDF...</span>
              </div>
              <span className="text-[10px] opacity-60 font-medium uppercase tracking-widest">{loadingStep}</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
              Generar Examen Maestro
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfigView;
