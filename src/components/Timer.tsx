"use client";
import { useEffect, useState } from "react";

interface TimerProps {
  startDate: string;
  endDate: string;
  isLoading: boolean;
}

const Timer: React.FC<TimerProps> = ({ startDate, endDate, isLoading }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (isLoading) {
      setTimeLeft("Loading...");
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Time is up!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [endDate, isLoading]);

  return <div className="text-white">{timeLeft}</div>;
};

export default Timer;
