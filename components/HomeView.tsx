
import React from 'react';

interface HomeViewProps {
  onStartTest: () => void;
  onStartExercise: () => void;
  onReadMore: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartTest, onStartExercise, onReadMore }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFBF7]">
      <div className="mb-12">
        <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center animate-breathe shadow-inner border border-stone-100">
          <svg className="w-16 h-16 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-serif text-stone-800 mb-2">BlinkRest</h1>
      <p className="text-lg text-stone-500 mb-12 max-w-sm mx-auto leading-relaxed">
        Relief for severe dry eyes through clinical testing and guided exercise.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={onStartExercise}
          className="w-full py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-all font-medium tracking-wide shadow-md"
        >
          2-Min Blinking Exercise
        </button>
        <button 
          onClick={onStartTest}
          className="w-full py-4 bg-white border border-stone-200 text-stone-800 rounded-full hover:bg-stone-50 transition-all font-medium tracking-wide"
        >
          Take Stability Test
        </button>
        <button 
          onClick={onReadMore}
          className="mt-4 text-stone-400 hover:text-stone-600 transition-colors font-medium text-sm underline underline-offset-8 decoration-stone-200"
        >
          What is TBUT?
        </button>
      </div>
    </div>
  );
};

export default HomeView;
