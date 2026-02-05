
import React from 'react';

interface HomeViewProps {
  onStartTest: () => void;
  onStartExercise: () => void;
  onReadMore: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartTest, onStartExercise, onReadMore }) => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FDFBF7] px-6 py-12">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center animate-breathe mx-auto mb-6 shadow-inner border border-stone-200">
          <svg className="w-10 h-10 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-stone-800 mb-2">BlinkRest</h1>
        <p className="text-stone-500 max-w-xs mx-auto text-sm leading-relaxed">
          Restore your eye health with clinical tests and rhythmic breathing for your eyes.
        </p>
      </header>

      {/* Tiles Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* First Tile: TBUT Test */}
        <button
          onClick={onStartTest}
          className="group relative flex flex-col items-center justify-center p-8 bg-white border border-stone-200 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center h-64"
        >
          <div className="mb-4 p-4 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Clinical Check</span>
          <h2 className="text-xl font-serif text-stone-800">Take Stability Test (TBUT)</h2>
          <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-amber-600 text-xs font-semibold">Start Now →</span>
          </div>
        </button>

        {/* Second Tile: Blinking Exercise */}
        <button
          onClick={onStartExercise}
          className="group relative flex flex-col items-center justify-center p-8 bg-stone-800 border border-stone-800 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center h-64"
        >
          <div className="mb-4 p-4 bg-stone-700 rounded-full group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Guided Relief</span>
          <h2 className="text-xl font-serif text-white">2-Min Blinking Exercise</h2>
          <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-stone-300 text-xs font-semibold">Begin Session →</span>
          </div>
        </button>
      </div>

      {/* Footer / Extra Link */}
      <footer className="mt-12">
        <button 
          onClick={onReadMore}
          className="text-stone-400 hover:text-stone-600 transition-colors text-xs font-semibold tracking-widest uppercase border-b border-stone-200 pb-1 hover:border-stone-400"
        >
          What is TBUT?
        </button>
      </footer>
    </div>
  );
};

export default HomeView;
