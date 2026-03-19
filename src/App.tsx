import { useState, useEffect } from 'react';
import { GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ResultsCard } from './components/ResultsCard';
import { HistoryTable } from './components/HistoryTable';
import { getFeedback } from './services/geminiService';
import { saveToHistory, getHistory, GradingResult } from './services/historyService';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GradingResult | null>(null);
  const [history, setHistory] = useState<GradingResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleGrade = async (modelAnswer: string, studentResponse: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Get SBERT Score from Backend
      const scoreResponse = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelAnswer, studentResponse }),
      });

      if (!scoreResponse.ok) {
        throw new Error('Failed to calculate similarity score. Please try again.');
      }

      const { score } = await scoreResponse.json();

      // 2. Get Qualitative Feedback from Gemini (Frontend)
      const feedback = await getFeedback(modelAnswer, studentResponse, score);

      const result: GradingResult = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        modelAnswer,
        studentResponse,
        score,
        feedback,
      };

      setCurrentResult(result);
      saveToHistory(result);
      setHistory(getHistory());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during grading.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">AI Exam Grader</h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Theoretical Assessment System</p>
            </div>
          </div>
          
          {currentResult && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Assessment
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-rose-900">Grading Error</h4>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!currentResult ? (
          <Dashboard onGrade={handleGrade} isLoading={isLoading} />
        ) : (
          <ResultsCard 
            score={currentResult.score} 
            feedback={currentResult.feedback} 
          />
        )}

        {/* History Section */}
        <HistoryTable 
          history={history} 
          onSelect={(result) => {
            setCurrentResult(result);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium uppercase tracking-widest">
          <p>© 2026 Academic AI Assessment Lab</p>
          <p>Powered by SBERT & Gemini 2.0 Flash</p>
        </div>
      </footer>
    </div>
  );
}
