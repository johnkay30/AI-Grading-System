export interface GradingResult {
  id: string;
  timestamp: number;
  modelAnswer: string;
  studentResponse: string;
  score: number;
  feedback: string;
}

export function saveToHistory(result: GradingResult) {
  const history = getHistory();
  const newHistory = [result, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem('grading_history', JSON.stringify(newHistory));
}

export function getHistory(): GradingResult[] {
  const stored = localStorage.getItem('grading_history');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}
