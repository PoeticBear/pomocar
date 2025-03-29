import { useState, useEffect, useRef } from 'react';

interface UseTimerProps {
  initialTime?: number;
  onComplete?: () => void;
}

export default function useTimer({ initialTime = 25 * 60, onComplete }: UseTimerProps = {}) {
  const [seconds, setSeconds] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 格式化时间为 MM:SS 格式
  const formattedTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 开始计时器
  const startTimer = () => {
    setIsActive(true);
  };

  // 重置计时器
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialTime);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onComplete]);

  return {
    seconds,
    isActive,
    formattedTime,
    startTimer,
    resetTimer
  };
}