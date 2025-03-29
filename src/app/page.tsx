import Image from "next/image";

'use client';

import { useState } from 'react';
import DesertScene from '../components/DesertScene';
import OceanScene from '../components/OceanScene';
import SnowScene from '../components/SnowScene';
import PomodoroTimer from '../components/PomodoroTimer';

// Theme types
type Theme = 'desert' | 'ocean' | 'snow';

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('desert');
  
  const handleStart = () => {
    setIsAnimating(true);
  };
  
  const handleComplete = () => {
    setIsAnimating(false);
  };
  
  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };
  
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full text-center py-2 text-[#8B4513] text-2xl font-bold z-10 shadow-sm">
        POMODORO CAR - CREATIVE POMODORO TIMER
      </div>
      
      {/* Theme switcher */}
      <div className="absolute top-12 right-4 z-50 bg-white/80 rounded-lg p-2 shadow-md">
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1.5 rounded-md transition-colors ${currentTheme === 'desert' ? 'bg-amber-500 text-white' : 'bg-gray-200 hover:bg-amber-200'}`}
            onClick={() => handleThemeChange('desert')}
          >
            Desert
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md transition-colors ${currentTheme === 'ocean' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-200'}`}
            onClick={() => handleThemeChange('ocean')}
          >
            Ocean
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md transition-colors ${currentTheme === 'snow' ? 'bg-cyan-500 text-white' : 'bg-gray-200 hover:bg-cyan-200'}`}
            onClick={() => handleThemeChange('snow')}
          >
            Snow
          </button>
        </div>
      </div>
      
      {/* Conditional rendering based on theme */}
      {currentTheme === 'desert' ? (
        <DesertScene isAnimating={isAnimating} />
      ) : currentTheme === 'ocean' ? (
        <OceanScene isAnimating={isAnimating} />
      ) : (
        <SnowScene isAnimating={isAnimating} />
      )}
      
      <PomodoroTimer 
        onStart={handleStart} 
        onComplete={handleComplete} 
      />
    </main>
  );
}
