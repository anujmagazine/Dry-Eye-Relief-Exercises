
import React, { useState } from 'react';
import { AppState, TestResult } from './types.ts';
import HomeView from './components/HomeView.tsx';
import TestView from './components/TestView.tsx';
import ResultsView from './components/ResultsView.tsx';
import InfoView from './components/InfoView.tsx';
import ExerciseView from './components/ExerciseView.tsx';
import PalmingView from './components/PalmingView.tsx';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('home');
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  const handleTestComplete = (result: TestResult) => {
    setLastResult(result);
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col">
      <main className="flex-grow container mx-auto max-w-screen-xl relative">
        {currentScreen === 'home' && (
          <HomeView 
            onStartTest={() => setCurrentScreen('test')} 
            onStartExercise={() => setCurrentScreen('exercise')}
            onStartPalming={() => setCurrentScreen('palming')}
          />
        )}
        
        {currentScreen === 'test' && (
          <TestView 
            onComplete={handleTestComplete}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'exercise' && (
          <ExerciseView 
            onExit={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'palming' && (
          <PalmingView 
            onExit={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'results' && lastResult && (
          <ResultsView 
            result={lastResult}
            onRetry={() => setCurrentScreen('test')}
            onExit={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'info' && (
          <InfoView 
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
