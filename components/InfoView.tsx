
import React from 'react';

interface InfoViewProps {
  onBack: () => void;
}

const InfoView: React.FC<InfoViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center flex flex-col items-center min-h-screen">
      <h2 className="text-3xl font-serif mb-8 text-stone-800">Why Blink Consciously?</h2>
      
      <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
        <p>
          In our modern world of screens, our blink rate drops significantly. Often, when we do blink, it's an "incomplete blink."
        </p>
        <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-2 italic">The Meibomian Glands</h3>
          <p>
            When you complete a full, conscious blink, your eyelids apply pressure to the Meibomian glands. This releases vital oils into your tear film, preventing evaporation and keeping your eyes hydrated.
          </p>
        </div>
        <p>
          Severe dry eye often stems from these oils not being replenished. 2 minutes of focused exercise "resets" this natural pump mechanism.
        </p>
      </div>

      <button 
        onClick={onBack}
        className="mt-12 px-8 py-3 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-colors duration-300 font-medium tracking-wide shadow-sm"
      >
        Understood
      </button>
    </div>
  );
};

export default InfoView;
