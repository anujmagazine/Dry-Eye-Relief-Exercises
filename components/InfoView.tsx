
import React from 'react';

interface InfoViewProps {
  onBack: () => void;
}

const InfoView: React.FC<InfoViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center flex flex-col items-center min-h-screen">
      <h2 className="text-3xl font-serif mb-8 text-stone-800">About the TBUT Test</h2>
      
      <div className="space-y-6 text-stone-600 leading-relaxed text-lg text-left">
        <p>
          <strong>Tear Break-Up Time (TBUT)</strong> is the clinical measurement of the time it takes for your tear film to evaporate or "break up" after a blink.
        </p>
        <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-2">Standard Benchmarks:</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="text-green-600 font-bold">&gt; 10 seconds:</span> Healthy stability.</li>
            <li><span className="text-amber-600 font-bold">5 - 10 seconds:</span> Marginal stability.</li>
            <li><span className="text-red-600 font-bold">&lt; 5 seconds:</span> Tear film instability (Severe Dry Eye).</li>
          </ul>
        </div>
        <p>
          This self-assessment tracks your symptoms at home. If you consistently score under 10 seconds, consult an eye professional.
        </p>
      </div>

      <button 
        onClick={onBack}
        className="mt-12 px-12 py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-colors font-medium"
      >
        Understood
      </button>
    </div>
  );
};

export default InfoView;
