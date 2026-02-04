
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlinkPhase, BLINK_CYCLES, PhaseInfo } from '../types.ts';
import { voiceService } from '../services/geminiService.ts';

interface ExerciseViewProps {
  onExit: () => void;
}

const EXERCISE_TOTAL_DURATION = 120; // 2 minutes

const ExerciseView: React.FC<ExerciseViewProps> = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(EXERCISE_TOTAL_DURATION);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(BLINK_CYCLES[0].duration);
  const [isFinished, setIsFinished] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  const startExercise = async () => {
    setIsActive(true);
    await voiceService.speak("Starting your two-minute blinking exercise. " + BLINK_CYCLES[0].instruction);
  };

  const announcePhase = useCallback(async (phase: PhaseInfo) => {
    await voiceService.speak(phase.instruction);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsFinished(true);
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });

      setPhaseSecondsLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          setCurrentPhaseIndex(currentIdx => {
            const nextIdx = (currentIdx + 1) % BLINK_CYCLES.length;
            const nextPhase = BLINK_CYCLES[nextIdx];
            announcePhase(nextPhase);
            return nextIdx;
          });
          // Note: we can't easily return the next duration here directly from setPhaseSecondsLeft 
          // because it depends on the index we just updated. 
          // We use a small hack or just rely on the effect below to sync it.
          return -1; 
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      voiceService.stop();
    };
  }, [isActive, announcePhase]);

  // Sync the phase duration when the index changes
  useEffect(() => {
    if (phaseSecondsLeft === -1) {
      setPhaseSecondsLeft(BLINK_CYCLES[currentPhaseIndex].duration);
    }
  }, [currentPhaseIndex, phaseSecondsLeft]);

  const handleRestart = () => {
    setTimeLeft(EXERCISE_TOTAL_DURATION);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(BLINK_CYCLES[0].duration);
    setIsFinished(false);
    setIsActive(true);
    announcePhase(BLINK_CYCLES[0]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFBF7]">
        <h2 className="text-3xl font-serif mb-6 text-stone-800">Conscious Blinking</h2>
        <p className="text-stone-500 mb-10 max-w-sm leading-relaxed">
          This 2-minute session helps restore the lipid layer of your tear film by ensuring full, complete blinks.
        </p>
        <button 
          onClick={startExercise}
          className="px-12 py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-all font-medium shadow-lg"
        >
          Begin Session
        </button>
        <button 
          onClick={onExit}
          className="mt-6 text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium"
        >
          Maybe Later
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFBF7]">
        <div className="w-24 h-24 mb-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-serif mb-4 text-stone-800">Session Complete</h2>
        <p className="text-stone-600 mb-12 max-w-sm">Your eyes should feel more lubricated. Consistency is key for severe dry eye relief.</p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-all font-medium shadow-md"
          >
            Practice Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 border border-stone-200 text-stone-600 rounded-full hover:bg-stone-50 transition-all font-medium"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentPhase = BLINK_CYCLES[currentPhaseIndex];

  const getVisualStyles = () => {
    switch(currentPhase.phase) {
      case BlinkPhase.CLOSE:
        return 'scale-y-[0.1] bg-stone-400 opacity-60 rounded-[100px]';
      case BlinkPhase.PAUSE:
        return 'scale-y-[0.05] bg-stone-500 opacity-40 rounded-[100px]';
      case BlinkPhase.OPEN:
      default:
        return 'scale-y-100 bg-stone-200 rounded-full';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-12 px-6 overflow-hidden bg-[#FDFBF7]">
      <div className="text-center">
        <h3 className="text-stone-400 font-medium tracking-widest uppercase text-[10px] mb-1">Time Remaining</h3>
        <span className="text-3xl font-light text-stone-700 tabular-nums">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-lg">
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-stone-100 rounded-full scale-110"></div>
          <div className="absolute inset-0 border border-stone-200 rounded-full animate-ping opacity-5"></div>
          
          <div className={`w-52 h-52 transition-all duration-700 ease-in-out flex items-center justify-center overflow-hidden border border-stone-100 shadow-inner ${getVisualStyles()}`}>
             <div className="w-16 h-16 bg-stone-800/10 rounded-full"></div>
          </div>
        </div>

        <div className="text-center min-h-[140px] flex flex-col items-center px-4">
          <h2 className="text-3xl font-serif text-stone-800 mb-6 transition-all duration-500 leading-tight">
            {currentPhase.instruction}
          </h2>
          <div className="flex gap-3">
            {Array.from({ length: currentPhase.duration }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i < (currentPhase.duration - phaseSecondsLeft) ? 'bg-stone-600 scale-110' : 'bg-stone-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
           <button 
            onClick={onExit}
            className="px-8 py-2 text-stone-400 hover:text-stone-800 transition-colors text-xs font-semibold tracking-widest uppercase border border-transparent hover:border-stone-200 rounded-full"
          >
            Cancel Session
          </button>
        </div>
        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-stone-800 transition-all duration-1000 ease-linear"
            style={{ width: `${(1 - timeLeft / EXERCISE_TOTAL_DURATION) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseView;
