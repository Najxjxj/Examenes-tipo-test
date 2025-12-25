
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Lightbulb, 
  ArrowRight, 
  Check, 
  FileText,
  Search,
  Bell,
  Sparkles
} from 'lucide-react';
import { ExamSession, Question } from '../../types';

interface PracticeViewProps {
  session: ExamSession;
  onFinish: (session: ExamSession) => void;
}

const PracticeView: React.FC<PracticeViewProps> = ({ session, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const currentQuestion = session.questions[currentIndex];
  
  const handleSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
    setShowExplanation(true);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const finishSession = () => {
    const finalQuestions = session.questions.map(q => ({
      ...q,
      userAnswer: answers[q.id],
      isCorrect: answers[q.id] === q.correctAnswer
    }));
    const correctCount = finalQuestions.filter(q => q.isCorrect).length;
    
    onFinish({
      ...session,
      questions: finalQuestions,
      score: correctCount, // Puntuación basada en conteo de correctas (1 punto por respuesta)
      timeElapsed: time
    });
  };

  const handleNext = () => {
    if (currentIndex < session.totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      const mainEl = document.getElementById('practice-main');
      if (mainEl) mainEl.scrollTop = 0;
    } else {
      finishSession();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b141d] flex flex-col overflow-hidden font-display selection:bg-primary/30">
      {/* Top Navigation Bar */}
      <header className="h-[72px] shrink-0 border-b border-white/5 bg-[#0b141d] px-8 flex items-center justify-between z-50">
        <h1 className="text-white text-xl font-bold tracking-tight">Modo Práctica</h1>
        
        <div className="flex items-center gap-6">
          <div className="relative group hidden md:block">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar test o documento..." 
              className="w-80 h-10 bg-[#17232e] border border-white/10 rounded-full pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Bell size={22} />
            </button>
            <div 
              className="size-10 rounded-full border-2 border-white/10 bg-center bg-cover"
              style={{ backgroundImage: 'url("https://picsum.photos/200")' }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="practice-main" className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar scroll-smooth">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left Side: Question & Explanation */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Document Info Box */}
            <div className="bg-[#17232e]/60 border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[4px_0_15px_rgba(19,127,236,0.4)]"></div>
              <div className="flex items-start gap-6 mb-8">
                <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner shrink-0">
                  <FileText size={28} />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl mb-1 truncate max-w-md">
                    Test Maestro: {session.topic}
                  </h2>
                  <p className="text-[#92adc9] text-xs font-black uppercase tracking-widest">
                    {currentIndex + 1} DE {session.totalQuestions} CONCEPTOS
                  </p>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-3xl md:text-[40px] font-black text-white leading-[1.2] tracking-tight">
                ¿{currentQuestion.text}?
              </h3>
            </div>

            {/* Explanation Card */}
            <div className={`transition-all duration-700 transform ${showExplanation ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
              <div className="bg-[#17232e]/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/20">
                      <Lightbulb size={24} />
                    </div>
                    <h4 className="text-2xl font-black text-white tracking-tight">Explicación del Mentor</h4>
                  </div>
                  
                  <div className="bg-[#0b141d]/50 p-8 rounded-3xl border border-white/5 shadow-inner">
                    <div className="text-white/80 text-lg leading-[1.6] font-medium">
                      <p className="opacity-95 text-justify">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                  <Lightbulb size={320} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Controls & Answers */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            
            {/* Timer and Exit */}
            <div className="bg-[#17232e]/40 border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4 px-6 py-3 bg-[#0b141d] border border-white/5 rounded-2xl">
                <Clock size={20} className="text-primary animate-pulse" />
                <span className="text-white font-mono font-black text-2xl leading-none">{formatTime(time)}</span>
              </div>
              <button 
                onClick={finishSession}
                className="px-8 py-3 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#ef4444] hover:text-white rounded-2xl text-sm font-black transition-all active:scale-95"
              >
                Salir
              </button>
            </div>

            {/* Answers List */}
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const isIncorrect = isSelected && !isCorrect;
                
                let containerStyles = "bg-[#17232e]/40 border-white/5 text-white/50 hover:bg-[#17232e]/80 hover:border-white/10";
                let textStyles = "text-white/60";
                
                if (showExplanation) {
                  if (isCorrect) {
                    containerStyles = "bg-[#0bda5b]/10 border-[#0bda5b] text-[#0bda5b] shadow-[0_0_30px_rgba(11,218,91,0.2)] ring-1 ring-[#0bda5b]/50";
                    textStyles = "text-[#0bda5b]";
                  } else if (isIncorrect) {
                    containerStyles = "bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.2)] ring-1 ring-[#ef4444]/50";
                    textStyles = "text-[#ef4444]";
                  } else {
                    containerStyles = "opacity-20 grayscale pointer-events-none border-white/5 text-white/20";
                    textStyles = "text-white/20";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    disabled={showExplanation}
                    className={`group relative flex items-center justify-between p-7 rounded-[1.5rem] border-2 transition-all duration-500 text-left ${containerStyles}`}
                  >
                    <span className={`text-lg md:text-xl font-bold flex-1 pr-6 leading-tight ${textStyles}`}>{option}</span>
                    <div className={`size-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                      showExplanation && isCorrect ? 'bg-[#0bda5b] border-[#0bda5b] text-white shadow-[0_0_15px_rgba(11,218,91,0.5)]' : 
                      showExplanation && isIncorrect ? 'bg-[#ef4444] border-[#ef4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                      'border-white/10 group-hover:border-primary'
                    }`}>
                      {showExplanation && (isCorrect ? <Check size={24} strokeWidth={4} /> : isIncorrect ? <X size={24} strokeWidth={4} /> : null)}
                      {!showExplanation && <div className="size-3 bg-white/5 rounded-full group-hover:bg-primary group-hover:scale-150 transition-all"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className={`mt-auto transition-all duration-500 transform ${showExplanation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
              <button 
                onClick={handleNext}
                className="w-full h-[72px] bg-primary hover:bg-primary-dark text-white text-2xl font-black rounded-[1.5rem] shadow-[0_15px_40px_rgba(19,127,236,0.3)] flex items-center justify-center gap-4 transition-all group active:scale-[0.97]"
              >
                <span>{currentIndex < session.totalQuestions - 1 ? 'Continuar' : 'Finalizar sesión'}</span>
                <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Background Orbs */}
      <div className="fixed top-1/4 -left-20 size-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 size-[500px] bg-[#ef4444]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
};

export default PracticeView;
