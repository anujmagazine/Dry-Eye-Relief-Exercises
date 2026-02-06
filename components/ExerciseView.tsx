
import React, { useState, useEffect, useRef } from 'react';
import { BlinkPhase, BLINK_CYCLES } from '../types.ts';
import { voiceService } from '../services/geminiService.ts';

interface ExerciseViewProps {
  onExit: () => void;
}

const EXERCISE_TOTAL_DURATION = 120; // 2 minutes
const INTRO_TEXT = "Starting your two-minute blinking exercise. Keep your eyes open and relax.";

const ExerciseView: React.FC<ExerciseViewProps> = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(EXERCISE_TOTAL_DURATION);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(BLINK_CYCLES[0].duration);
  const [isFinished, setIsFinished] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  
  const timerRef = useRef<number | null>(null);

  // Initial Preload
  useEffect(() => {
    const preloadAll = async () => {
      try {
        await voiceService.preload(INTRO_TEXT);
        for (const cycle of BLINK_CYCLES) {
          await voiceService.preload(cycle.instruction);
        }
      } catch (e) {
        console.error("Failed to preload audio assets", e);
      } finally {
        setIsPreloading(false);
      }
    };
    preloadAll();
    return () => voiceService.stop();
  }, []);

  // Trigger voice exactly when phase index changes
  useEffect(() => {
    if (isActive && !isFinished) {
      // If it's the very first phase of the session, we can prepend the intro or just play instruction
      const instruction = BLINK_CYCLES[currentPhaseIndex].instruction;
      // To avoid overlap with startExercise, we rely primarily on this effect for the instruction
      voiceService.speak(instruction);
    }
  }, [currentPhaseIndex, isActive, isFinished]);

  const startExercise = async () => {
    // We play the intro first, then set isActive to start the cycles
    await voiceService.speak(INTRO_TEXT);
    setIsActive(true);
  };

  useEffect(() => {
    if (!isActive || isFinished) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setIsFinished(true);
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });

      setPhaseSecondsLeft(prev => {
        if (prev <= 0) {
          // Switch phase state
          setCurrentPhaseIndex(currentIdx => {
            const nextIdx = (currentIdx + 1) % BLINK_CYCLES.length;
            return nextIdx;
          });
          return -1; // Flag for reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isActive, isFinished]);

  // Cleanup/Sync phase duration
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
    startExercise();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isPreloading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFBF7]">
        <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-serif text-stone-600">Calibrating Audio...</h2>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFBF7]">
        <h2 className="text-3xl font-serif mb-6 text-stone-800">Conscious Blinking</h2>
        <p className="text-stone-500 mb-10 max-w-sm leading-relaxed">
          This session ensures your eyelids fully close and seal, spreading vital lipids across the eye surface.
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
        <p className="text-stone-600 mb-12 max-w-sm">Consistency is the key to treating severe dry eye. Practice this twice daily.</p>
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
        return 'scale-y-[0.15] bg-stone-300 rounded-[80px]';
      case BlinkPhase.PAUSE:
        return 'scale-y-[0.08] bg-stone-400 rounded-[100px] blur-[1px]';
      case BlinkPhase.OPEN:
      default:
        return 'scale-y-100 bg-stone-100 rounded-full';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-12 px-6 overflow-hidden bg-[#FDFBF7]">
      <div className="text-center">
        <h3 className="text-stone-400 font-medium tracking-widest uppercase text-[10px] mb-1">Total Remaining</h3>
        <span className="text-3xl font-light text-stone-700 tabular-nums">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-lg">
        <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-stone-100 rounded-full"></div>
          
          <div className={`w-56 h-56 transition-all duration-[800ms] ease-in-out flex items-center justify-center overflow-hidden border border-stone-200 shadow-inner ${getVisualStyles()}`}>
             <div className="w-20 h-20 bg-stone-800/5 rounded-full"></div>
          </div>
        </div>

        <div className="text-center min-h-[140px] flex flex-col items-center px-4">
          <h2 className="text-3xl font-serif text-stone-800 mb-6 transition-all duration-500 leading-tight">
            {currentPhase.instruction}
          </h2>
          <div className="flex gap-3">
            {Array.from({ length: BLINK_CYCLES[currentPhaseIndex].duration }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-all duration-700 ${i < (BLINK_CYCLES[currentPhaseIndex].duration - Math.max(0, phaseSecondsLeft)) ? 'bg-stone-700 scale-125' : 'bg-stone-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
           <button 
            onClick={onExit}
            className="px-8 py-2 text-stone-400 hover:text-stone-800 transition-colors text-xs font-semibold tracking-widest uppercase border border-stone-200 hover:bg-white rounded-full"
          >
            End Early
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
