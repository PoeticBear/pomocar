'use client';

import { useState } from 'react';
import useTimer from '../hooks/useTimer';

interface PomodoroTimerProps {
  onStart: () => void;
  onComplete: () => void;
}

export default function PomodoroTimer({ onStart, onComplete }: PomodoroTimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const { formattedTime, startTimer } = useTimer({
    initialTime: 25 * 60,
    onComplete
  });
  
  const handleStart = () => {
    setIsStarted(true);
    startTimer();
    onStart();
  };
  
  return (
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black/70 p-5 rounded-lg z-50"
      style={{ opacity: isStarted ? 0.5 : 1 }}
    >
      <div className="text-5xl mb-5">{formattedTime()}</div>
      <button
        className="px-5 py-2.5 text-lg bg-green-600 text-white border-none rounded cursor-pointer transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleStart}
        disabled={isStarted}
      >
        {isStarted ? 'Driving...' : 'Start'}
      </button>
    </div>
  );
}