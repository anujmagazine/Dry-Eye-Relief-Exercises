
export type AppState = 'home' | 'exercise' | 'info';

export enum BlinkPhase {
  CLOSE = 'CLOSE',
  PAUSE = 'PAUSE',
  OPEN = 'OPEN'
}

export interface PhaseInfo {
  phase: BlinkPhase;
  instruction: string;
  duration: number; // in seconds
}

export const BLINK_CYCLES: PhaseInfo[] = [
  { phase: BlinkPhase.CLOSE, instruction: 'Close eyes slowly', duration: 2 },
  { phase: BlinkPhase.PAUSE, instruction: 'Pause', duration: 2 },
  { phase: BlinkPhase.OPEN, instruction: 'Open gently', duration: 2 },
];
