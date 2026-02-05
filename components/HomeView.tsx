
import React from 'react';

interface HomeViewProps {
  onStartTest: () => void;
  onStartExercise: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartTest, onStartExercise }) => {
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
          className="group relative flex flex-col items-center justify-start p-8 bg-white border border-stone-200 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center min-h-[22rem]"
        >
          <div className="mb-4 p-4 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Clinical Check</span>
          <h2 className="text-xl font-serif text-stone-800 mb-3">Take Stability Test (TBUT)</h2>
          
          <div className="text-stone-500 text-xs leading-relaxed max-w-[240px] mb-4 text-center">
            <p className="mb-3">Tear Break-Up Time measures how long your tear film stays stable after a blink.</p>
            <div className="flex flex-col items-start bg-stone-50 p-3 rounded-xl border border-stone-100 w-full">
              <span className="font-bold text-[9px] uppercase tracking-wider text-stone-400 mb-2">Benchmarks</span>
              <div className="flex justify-between w-full text-[10px]">
                <span className="text-green-600 font-medium">&gt;10s Healthy</span>
                <span className="text-amber-600 font-medium">5-10s Marginal</span>
                <span className="text-red-600 font-medium">&lt;5s Dry Eye</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4">
            <span className="text-amber-600 text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block">Start Test →</span>
          </div>
        </button>

        {/* Second Tile: Blinking Exercise */}
        <button
          onClick={onStartExercise}
          className="group relative flex flex-col items-center justify-start p-8 bg-stone-800 border border-stone-800 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center min-h-[22rem]"
        >
          <div className="mb-4 p-4 bg-stone-700 rounded-full group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Guided Relief</span>
          <h2 className="text-xl font-serif text-white mb-3">2-Min Blinking Exercise</h2>
          
          <p className="text-stone-400 text-xs leading-relaxed max-w-[240px] mb-4">
            Perform rhythmic, conscious blinks to stimulate meibomian glands and restore your eye's natural lipid layer.
          </p>

          <div className="flex flex-col items-start bg-stone-700/30 p-3 rounded-xl w-full">
            <span className="font-bold text-[9px] uppercase tracking-wider text-stone-500 mb-2">Session Goals</span>
            <div className="text-[10px] text-stone-300 text-left space-y-1">
              <p>• Stimulate natural lubrication</p>
              <p>• Ensure complete eyelid seal</p>
              <p>• Relieve digital eye strain</p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <span className="text-stone-300 text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block">Begin Session →</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
