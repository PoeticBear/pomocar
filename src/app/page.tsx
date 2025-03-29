import Image from "next/image";

'use client';

import { useState } from 'react';
import DesertScene from '../components/DesertScene';
import PomodoroTimer from '../components/PomodoroTimer';

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleStart = () => {
    setIsAnimating(true);
  };
  
  const handleComplete = () => {
    setIsAnimating(false);
  };
  
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full text-center py-2 text-[#8B4513] text-2xl font-bold z-10 shadow-sm">
        POMODORO CAR
      </div>
      
      <DesertScene isAnimating={isAnimating} />
      
      <PomodoroTimer 
        onStart={handleStart} 
        onComplete={handleComplete} 
      />
    </main>
  );
}
