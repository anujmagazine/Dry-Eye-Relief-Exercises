
import React, { useState, useEffect, useRef } from 'react';
import { voiceService } from '../services/geminiService.ts';

interface PalmingViewProps {
  onExit: () => void;
}

const PALMING_DURATION = 180; // 3 minutes
const STEPS = [
  { time: 180, text: "Rub your palms together vigorously to generate warmth.", voice: "Start by rubbing your palms together until they feel warm." },
  { time: 170, text: "Cup your eyes gently. Avoid pressing the eyeballs.", voice: "Now, gently cup your palms over your closed eyes. Ensure no light gets in, but do not press against your eyelids." },
  { time: 150, text: "Breathe deeply and sink into the darkness.", voice: "Focus on the darkness. Breathe slowly and let your eye muscles completely relax." },
  { time: 60, text: "Almost there. Feel the tension leaving your brow.", voice: "Halfway through. Let go of any tension in your forehead and jaw." },
  { time: 10, text: "Gently remove your hands and blink softly.", voice: "The session is ending. Gently remove your hands and blink slowly as you adjust to the light." }
];

const PalmingView: React.FC<PalmingViewProps> = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(PALMING_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Initial voice instruction
    voiceService.speak("Welcome to deep relaxation. Let's begin by warming your hands.");
    setIsActive(true);
    
    return () => {
        voiceService.stop();
        if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive || isFinished) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isActive, isFinished]);

  // Handle voice triggers at specific timestamps
  useEffect(() => {
    const currentStep = STEPS.find(s => s.time === timeLeft);
    if (currentStep) {
      voiceService.speak(currentStep.voice);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentStatusText = STEPS.reduce((acc, step) => {
    return timeLeft <= step.time ? step.text : acc;
  }, STEPS[0].text);

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-indigo-950 text-indigo-100">
        <h2 className="text-4xl font-serif mb-6">Eyes Restored</h2>
        <p className="text-indigo-300 mb-12 max-w-xs">Your eye muscles have reset. You should feel less strain and squinting now.</p>
        <button 
          onClick={onExit}
          className="px-12 py-4 bg-indigo-100 text-indigo-950 rounded-full font-bold shadow-xl hover:bg-white transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-16 px-6 bg-stone-950 text-stone-200 transition-colors duration-1000">
      <div className="text-center">
        <h3 className="text-stone-500 font-medium tracking-widest uppercase text-[10px] mb-2">Relaxation Timer</h3>
        <span className="text-5xl font-light tabular-nums text-stone-300">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md">
        <div className="relative w-64 h-64 mb-16">
          {/* Pulsing "Darkness" Indicator */}
          <div className="absolute inset-0 bg-stone-900 rounded-full animate-breathe blur-xl opacity-30"></div>
          <div className="absolute inset-4 border border-stone-800 rounded-full flex items-center justify-center">
             <div className="w-12 h-12 bg-indigo-500/20 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="text-center px-4 h-32 flex flex-col justify-center">
          <p className="text-xl font-serif italic text-stone-400 leading-relaxed mb-4">
            "{currentStatusText}"
          </p>
          <p className="text-stone-600 text-xs uppercase tracking-tighter">Keep your eyes cupped and breathe.</p>
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center">
        <button 
          onClick={onExit}
          className="mb-8 text-stone-600 hover:text-stone-400 transition-colors text-xs font-semibold tracking-widest uppercase"
        >
          End Session
        </button>
        <div className="w-full h-0.5 bg-stone-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500/50 transition-all duration-1000 ease-linear"
            style={{ width: `${(1 - timeLeft / PALMING_DURATION) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PalmingView;
