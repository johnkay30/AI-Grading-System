import React, { useState } from 'react';
import { BookOpen, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  onGrade: (modelAnswer: string, studentResponse: string) => Promise<void>;
  isLoading: boolean;
}

export function Dashboard({ onGrade, isLoading }: DashboardProps) {
  const [modelAnswer, setModelAnswer] = useState('');
  const [studentResponse, setStudentResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelAnswer.trim() || !studentResponse.trim()) return;
    await onGrade(modelAnswer, studentResponse);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Grading Dashboard</h2>
          <p className="text-sm text-slate-500 italic font-serif">Input the model answer and student response for analysis.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              Model Answer
              <span className="text-xs font-normal text-slate-400">(Reference)</span>
            </label>
            <textarea
              value={modelAnswer}
              onChange={(e) => setModelAnswer(e.target.value)}
              placeholder="Paste the ideal answer here..."
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-800"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              Student Response
              <span className="text-xs font-normal text-slate-400">(To be graded)</span>
            </label>
            <textarea
              value={studentResponse}
              onChange={(e) => setStudentResponse(e.target.value)}
              placeholder="Paste the student's response here..."
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-800"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading || !modelAnswer.trim() || !studentResponse.trim()}
            className={cn(
              "flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-200",
              isLoading && "animate-pulse"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Grade Submission
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
