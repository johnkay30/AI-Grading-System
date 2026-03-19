import { History as HistoryIcon, ChevronRight } from 'lucide-react';
import { GradingResult } from '../services/historyService';

interface HistoryTableProps {
  history: GradingResult[];
  onSelect: (result: GradingResult) => void;
}

export function HistoryTable({ history, onSelect }: HistoryTableProps) {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2">
        <HistoryIcon className="w-5 h-5 text-slate-400" />
        <h3 className="font-semibold text-slate-900">Grading History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Response (Snippet)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(item.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                  {item.studentResponse}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.score >= 8 ? 'bg-emerald-100 text-emerald-800' : 
                    item.score >= 5 ? 'bg-amber-100 text-amber-800' : 
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {item.score}/10
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onSelect(item)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
