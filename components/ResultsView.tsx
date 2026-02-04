
import React from 'react';
import { TestResult } from '../types.ts';

interface ResultsViewProps {
  result: TestResult;
  onRetry: () => void;
  onExit: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onRetry, onExit }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFBF7]">
      <div className={`text-6xl font-serif mb-2 ${result.color}`}>
        {result.seconds.toFixed(1)}s
      </div>
      <div className={`text-xl font-medium mb-8 ${result.color} uppercase tracking-widest`}>
        {result.category}
      </div>

      <div className="max-w-sm p-8 bg-white rounded-3xl border border-stone-100 shadow-sm mb-12">
        <p className="text-stone-600 leading-relaxed">
          {result.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={onRetry}
          className="w-full py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-all font-medium"
        >
          Retry Test
        </button>
        <button 
          onClick={onExit}
          className="w-full py-4 border border-stone-200 text-stone-600 rounded-full hover:bg-stone-50 transition-all font-medium"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
