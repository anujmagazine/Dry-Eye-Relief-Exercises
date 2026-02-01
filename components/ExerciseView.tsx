
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlinkPhase, BLINK_CYCLES, PhaseInfo } from '../types';
import { voiceService } from '../services/geminiService';

interface ExerciseViewProps {
  onExit: () => void;
}

const EXERCISE_TOTAL_DURATION = 120; // 2 minutes

const ExerciseView: React.FC<ExerciseViewProps> = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(EXERCISE_TOTAL_DURATION);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(BLINK_CYCLES[0].duration);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const hasAnnouncedInitialRef = useRef(false);

  // Using a ref for the latest state to avoid effect dependency churn
  const stateRef = useRef({
    timeLeft,
    currentPhaseIndex,
    phaseSecondsLeft,
    isFinished
  });

  useEffect(() => {
    stateRef.current = { timeLeft, currentPhaseIndex, phaseSecondsLeft, isFinished };
  }, [timeLeft, currentPhaseIndex, phaseSecondsLeft, isFinished]);

  const announcePhase = useCallback((phase: PhaseInfo) => {
    voiceService.speak(phase.instruction);
  }, []);

  useEffect(() => {
    // Initial announcement only once on mount
    if (!hasAnnouncedInitialRef.current) {
      announcePhase(BLINK_CYCLES[0]);
      hasAnnouncedInitialRef.current = true;
    }

    timerRef.current = window.setInterval(() => {
      const { timeLeft: tLeft, currentPhaseIndex: cIdx, phaseSecondsLeft: pLeft, isFinished: finished } = stateRef.current;
      
      if (finished || tLeft <= 0) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setIsFinished(true);
        return;
      }

      // Decrement phase time
      if (pLeft <= 1) {
        // Transition to next phase
        const nextIdx = (cIdx + 1) % BLINK_CYCLES.length;
        const nextPhase = BLINK_CYCLES[nextIdx];
        
        setCurrentPhaseIndex(nextIdx);
        setPhaseSecondsLeft(nextPhase.duration);
        announcePhase(nextPhase);
      } else {
        setPhaseSecondsLeft(pLeft - 1);
      }

      // Decrement total time
      setTimeLeft(tLeft - 1);
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      voiceService.stop(); // Stop any speaking on exit
    };
  }, [announcePhase]);

  const handleRestart = () => {
    setTimeLeft(EXERCISE_TOTAL_DURATION);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(BLINK_CYCLES[0].duration);
    setIsFinished(false);
    announcePhase(BLINK_CYCLES[0]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentPhase = BLINK_CYCLES[currentPhaseIndex];

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="w-24 h-24 mb-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-serif mb-4 text-stone-800">Session Complete</h2>
        <p className="text-stone-600 mb-12 max-w-sm">Your eyes are now more hydrated and refreshed. Take a deep breath.</p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-all font-medium"
          >
            Practice Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 border border-stone-200 text-stone-600 rounded-full hover:bg-stone-50 transition-all font-medium"
          >
            Finish & Exit
          </button>
        </div>
      </div>
    );
  }

  const getVisualScale = () => {
    if (currentPhase.phase === BlinkPhase.CLOSE) return 'scale-y-[0.1]';
    if (currentPhase.phase === BlinkPhase.PAUSE) return 'scale-y-[0.05]';
    return 'scale-y-100';
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-12 px-6 overflow-hidden">
      <div className="text-center">
        <h3 className="text-stone-400 font-medium tracking-widest uppercase text-sm mb-2">Timer</h3>
        <span className="text-4xl font-light text-stone-800">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
          <div className="absolute inset-0 border border-stone-200 rounded-full animate-pulse"></div>
          <div className={`w-48 h-48 bg-stone-200 rounded-full transition-all duration-1000 ease-in-out ${getVisualScale()}`}>
             <div className="w-24 h-24 bg-stone-300 rounded-full m-auto mt-[25%] opacity-50"></div>
          </div>
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white/40 rounded-full"></div>
        </div>

        <div className="text-center h-24 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-serif text-stone-800 mb-2 transition-opacity duration-500">
            {currentPhase.instruction}
          </h2>
          <p className="text-stone-400 text-sm italic">Keep your face and shoulders relaxed</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
           <button 
            onClick={onExit}
            className="px-8 py-2 text-stone-400 hover:text-stone-800 transition-colors text-sm font-medium"
          >
            Exit Session
          </button>
        </div>
        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-stone-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(1 - timeLeft / EXERCISE_TOTAL_DURATION) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseView;
