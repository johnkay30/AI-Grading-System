import { Award, MessageSquare, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ResultsCardProps {
  score: number;
  feedback: string;
}

export function ResultsCard({ score, feedback }: ResultsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Final Score</h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * score) / 10}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  score >= 8 ? "text-emerald-500" : score >= 5 ? "text-amber-500" : "text-rose-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">{score}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">/ 10</span>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600 italic font-serif">
            {score >= 8 ? "Excellent Performance" : score >= 5 ? "Satisfactory" : "Needs Improvement"}
          </p>
        </div>
      </div>

      <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Professor's Feedback</h3>
        </div>
        <div className="p-8">
          <div className="relative">
            <div className="absolute -left-2 top-0 text-slate-200 text-6xl font-serif select-none">“</div>
            <p className="relative z-10 text-lg text-slate-700 leading-relaxed font-serif italic pl-4">
              {feedback}
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl flex gap-3 items-start">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-normal">
              This score is calculated using semantic similarity analysis (SBERT) to ensure objective grading based on content relevance rather than response length.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
