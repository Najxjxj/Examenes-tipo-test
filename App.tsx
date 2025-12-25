
import React, { useState } from 'react';
import { View, AppState, FileData, ExamSession, StudyMode } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/views/DashboardView';
import UploadView from './components/views/UploadView';
import ConfigView from './components/views/ConfigView';
import PracticeView from './components/views/PracticeView';
import ExamModeView from './components/views/ExamModeView';
import ResultsView from './components/views/ResultsView';
import HistoryView from './components/views/HistoryView';
import SettingsView from './components/views/SettingsView';

const INITIAL_SESSIONS: ExamSession[] = [];
const INITIAL_FILES: FileData[] = [];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: View.DASHBOARD,
    files: INITIAL_FILES,
    sessions: INITIAL_SESSIONS,
    activeSession: null
  });

  const [referenceContext, setReferenceContext] = useState<string | undefined>();

  const navigateTo = (view: View) => {
    setState(prev => ({ ...prev, view }));
  };

  const handleStartExam = (session: ExamSession) => {
    setState(prev => ({
      ...prev,
      activeSession: session,
      view: session.mode === StudyMode.PRACTICE ? View.PRACTICE : View.EXAM
    }));
  };

  const handleFinishExam = (results: ExamSession) => {
    setState(prev => ({
      ...prev,
      activeSession: results,
      sessions: [results, ...prev.sessions],
      view: View.RESULTS
    }));
  };

  const renderView = () => {
    switch (state.view) {
      case View.DASHBOARD:
        return <DashboardView 
          onUpload={() => navigateTo(View.UPLOAD)} 
          onStartExam={() => navigateTo(View.CONFIG)}
          recentFiles={state.files}
          recentSessions={state.sessions}
        />;
      case View.UPLOAD:
        return <UploadView 
          onFilesReady={(files, refText) => {
            setState(prev => ({ ...prev, files: [...files, ...prev.files] }));
            setReferenceContext(refText);
            navigateTo(View.CONFIG);
          }}
          onCancel={() => navigateTo(View.DASHBOARD)}
        />;
      case View.CONFIG:
        return <ConfigView 
          files={state.files.filter(f => f.status === 'ready')}
          referenceText={referenceContext}
          onGenerate={(session) => handleStartExam(session)}
        />;
      case View.PRACTICE:
        return state.activeSession ? (
          <PracticeView 
            session={state.activeSession}
            onFinish={handleFinishExam}
          />
        ) : null;
      case View.EXAM:
        return state.activeSession ? (
          <ExamModeView 
            session={state.activeSession}
            onFinish={handleFinishExam}
          />
        ) : null;
      case View.RESULTS:
        return state.activeSession ? (
          <ResultsView 
            session={state.activeSession}
            onRetry={() => handleStartExam(state.activeSession!)}
            onNew={() => navigateTo(View.UPLOAD)}
          />
        ) : null;
      case View.HISTORY:
        return <HistoryView sessions={state.sessions} onStart={handleStartExam} />;
      case View.SETTINGS:
        return <SettingsView />;
      default:
        return <DashboardView onUpload={() => navigateTo(View.UPLOAD)} onStartExam={() => navigateTo(View.CONFIG)} recentFiles={state.files} recentSessions={state.sessions} />;
    }
  };

  const showSidebar = ![View.PRACTICE, View.EXAM].includes(state.view);

  const getTitle = () => {
    switch(state.view) {
      case View.DASHBOARD: return "Panel de Control";
      case View.UPLOAD: return "Subir Documentos";
      case View.CONFIG: return "Configurar Test";
      case View.PRACTICE: return "Modo Práctica";
      case View.EXAM: return "Modo Examen";
      case View.RESULTS: return "Resultados";
      case View.HISTORY: return "Mi Progreso";
      case View.SETTINGS: return "Ajustes";
      default: return "StudyGen";
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden font-display">
      {showSidebar && (
        <Sidebar activeView={state.view} onNavigate={navigateTo} />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={getTitle()} 
          onLogout={() => {}}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
