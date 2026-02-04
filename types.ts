
export type AppState = 'home' | 'test' | 'results' | 'info' | 'exercise';

export interface TestResult {
  seconds: number;
  category: 'Normal' | 'Marginal' | 'Dry Eye';
  color: string;
  description: string;
}

export enum BlinkPhase {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  PAUSE = 'PAUSE'
}

export interface PhaseInfo {
  phase: BlinkPhase;
  duration: number;
  instruction: string;
}

export const BLINK_CYCLES: PhaseInfo[] = [
  { phase: BlinkPhase.OPEN, duration: 4, instruction: "Keep your eyes open and relax." },
  { phase: BlinkPhase.CLOSE, duration: 3, instruction: "Close your eyes gently." },
  { phase: BlinkPhase.PAUSE, duration: 3, instruction: "Squeeze your eyelids slightly and hold." }
];

export function getCategory(seconds: number): TestResult {
  if (seconds >= 10) {
    return {
      seconds,
      category: 'Normal',
      color: 'text-green-600',
      description: 'Your tear film appears stable. This is a standard healthy result for eye hydration.'
    };
  } else if (seconds >= 5) {
    return {
      seconds,
      category: 'Marginal',
      color: 'text-amber-600',
      description: 'Your tear film is breaking up slightly earlier than ideal. Consider regular blinking breaks.'
    };
  } else {
    return {
      seconds,
      category: 'Dry Eye',
      color: 'text-red-600',
      description: 'Your tear film is breaking up rapidly. This is common in severe dry eye conditions. Please consult a specialist.'
    };
  }
}
