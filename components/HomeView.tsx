
import React from 'react';

interface HomeViewProps {
  onStart: () => void;
  onReadMore: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart, onReadMore }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="mb-12 relative">
        <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center animate-breathe">
          <svg className="w-16 h-16 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">BlinkRest</h1>
      <p className="text-lg text-stone-500 mb-12 max-w-sm mx-auto leading-relaxed">
        A 2-minute conscious blinking practice to refresh and hydrate your eyes.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={onStart}
          className="w-full py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium tracking-wide"
        >
          Begin Exercise
        </button>
        <button 
          onClick={onReadMore}
          className="w-full py-4 text-stone-600 hover:text-stone-800 transition-colors font-medium underline underline-offset-8 decoration-stone-200"
        >
          How it helps dry eyes
        </button>
      </div>

      <footer className="mt-24 text-stone-300 text-xs tracking-widest uppercase">
        Gentle Guidance for Sensitive Eyes
      </footer>
    </div>
  );
};

export default HomeView;
