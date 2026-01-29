
import React, { useState } from 'react';
import { AppState } from './types';
import HomeView from './components/HomeView';
import ExerciseView from './components/ExerciseView';
import InfoView from './components/InfoView';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('home');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 selection:bg-stone-200 flex flex-col transition-all duration-700 ease-in-out">
      <main className="flex-grow container mx-auto max-w-screen-xl relative">
        {currentScreen === 'home' && (
          <HomeView 
            onStart={() => setCurrentScreen('exercise')} 
            onReadMore={() => setCurrentScreen('info')}
          />
        )}
        
        {currentScreen === 'exercise' && (
          <ExerciseView 
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
