
import React, { useState, useEffect, useRef } from 'react';
import { voiceService } from '../services/geminiService.ts';
import { getCategory, TestResult } from '../types.ts';

interface TestViewProps {
  onComplete: (result: TestResult) => void;
  onCancel: () => void;
}

type TestState = 'prep' | 'staring' | 'calculating';

const TestView: React.FC<TestViewProps> = ({ onComplete, onCancel }) => {
  const [testState, setTestState] = useState<TestState>('prep');
  const [seconds, setSeconds] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // Handle Voice Announcement and Phase Transition
  useEffect(() => {
    let active = true;
    if (testState === 'prep') {
      const runPrep = async () => {
        // Wait for the voice to finish its explanation before starting the test phase
        await voiceService.speak("Please blink twice now. Then, keep your eyes open and stare at the target until you feel discomfort.");
        if (active) {
          setTestState('staring');
        }
      };
      runPrep();
    }
    return () => {
      active = false;
      voiceService.stop();
    };
  }, [testState]);

  // Handle the active timer during 'staring' phase
  useEffect(() => {
    let intervalId: number | null = null;

    if (testState === 'staring') {
      startTimeRef.current = Date.now();
      
      intervalId = window.setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setSeconds(elapsed);
        }
      }, 50);
    }

    return () => {
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [testState]);

  const stopTest = () => {
    const finalSeconds = seconds;
    setTestState('calculating');
    setTimeout(() => {
      onComplete(getCategory(finalSeconds));
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-12 px-6 bg-[#FDFBF7]">
      <div className="text-center">
        <h3 className="text-stone-400 font-medium tracking-widest uppercase text-xs mb-1">Stability Timer</h3>
        <span className="text-7xl font-light text-stone-800 tabular-nums">
          {seconds.toFixed(1)}<span className="text-2xl ml-1 text-stone-400">s</span>
        </span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-lg">
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-stone-200 rounded-full scale-125 opacity-20"></div>
          {testState === 'prep' ? (
             <div className="w-48 h-48 bg-stone-100 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-stone-500 font-medium text-center px-4 italic">Listening...</span>
             </div>
          ) : (
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center overflow-hidden border border-stone-200 shadow-sm transition-all duration-500">
               <div className="w-14 h-14 bg-stone-800 rounded-full shadow-lg relative">
                  <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full"></div>
               </div>
            </div>
          )}
        </div>

        <div className="text-center h-24">
          <h2 className="text-2xl font-serif text-stone-800 mb-2">
            {testState === 'prep' ? "Instructions" : "Maintain Focus"}
          </h2>
          <p className="text-stone-500 text-sm max-w-[220px] mx-auto leading-relaxed">
            {testState === 'prep' 
              ? "Listen to the voice guide for setup." 
              : "Tap the button the instant you feel any eye discomfort."}
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {testState === 'staring' && (
          <button 
            onClick={stopTest}
            className="w-full py-6 bg-stone-800 text-white rounded-2xl hover:bg-stone-900 active:scale-95 transition-all font-bold text-lg shadow-xl shadow-stone-200 uppercase tracking-wider"
          >
            I Feel Discomfort
          </button>
        )}
        <button 
          onClick={onCancel}
          className="w-full py-3 text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium tracking-wide"
        >
          Cancel Test
        </button>
      </div>
    </div>
  );
};

export default TestView;
