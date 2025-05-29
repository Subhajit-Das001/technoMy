import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/**
 * AnimatedCountdown - A reusable countdown component with smooth animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.startTime - ISO format start time (e.g. "2025-05-17T09:00:00.000Z")
 * @param {string} props.endTime - ISO format end time (e.g. "2025-05-17T09:00:00.000Z") 
 * @param {string} props.className - Optional additional classes for container
 * @param {boolean} props.showLabels - Whether to show day/hour/minute/second labels (default: true)
 * @param {string} props.activeTimeType - Which time to count towards: "start" or "end" (default: "end")
 * @param {string} props.timezone - Timezone for the countdown target (e.g. "America/New_York")
 * @returns {JSX.Element}
 */
export default function AnimatedCountdown({ 
  startTime, 
  endTime, 
  className = "",
  showLabels = true,
  activeTimeType = "end",
  timezone
}) {
  const [isNegative, setIsNegative] = useState(false);
  const targetDateRef = useRef(activeTimeType === 'start' ? startTime : endTime);

  // Update target date if props change
  useEffect(() => {
    targetDateRef.current = activeTimeType === 'start' ? startTime : endTime;
  }, [startTime, endTime, activeTimeType]);

  // Determine if countdown is negative (past the target date)
  useEffect(() => {
    const checkIfNegative = () => {
      const now = new Date();
      const target = new Date(targetDateRef.current);
      
      // Convert target time to user's timezone if provided
      const targetTime = timezone ? 
        new Date(target.toLocaleString('en-US', { timeZone: timezone })) : 
        target;
        
      setIsNegative(targetTime - now < 0);
    };
    
    checkIfNegative();
    const timer = setInterval(checkIfNegative, 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  return (
    <div className={`bg-gradient-to-br from-violet-600 to-indigo-600 p-4 ${className}`}>
      <div className="mx-auto flex w-full max-w-5xl items-center bg-white">
        <CountdownItem 
          unit="Day" 
          text="days" 
          targetDate={targetDateRef.current} 
          timezone={timezone}
          isNegative={isNegative}
          showLabel={showLabels}
        />
        <CountdownItem 
          unit="Hour" 
          text="hours" 
          targetDate={targetDateRef.current} 
          timezone={timezone}
          isNegative={isNegative}
          showLabel={showLabels}
        />
        <CountdownItem 
          unit="Minute" 
          text="minutes" 
          targetDate={targetDateRef.current} 
          timezone={timezone}
          isNegative={isNegative}
          showLabel={showLabels}
        />
        <CountdownItem 
          unit="Second" 
          text="seconds" 
          targetDate={targetDateRef.current}
          timezone={timezone} 
          isNegative={isNegative}
          showLabel={showLabels}
        />
      </div>
    </div>
  );
}

const CountdownItem = ({ unit, text, targetDate, timezone, isNegative = false, showLabel = true }) => {
  const { ref, time } = useShiftingTimer(unit, targetDate, timezone, isNegative);
  
  return (
    <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono last:border-r-0 md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-2xl font-medium text-black md:text-4xl lg:text-6xl xl:text-7xl"
        >
          {isNegative ? `-${time}` : time}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs font-light text-slate-500 md:text-sm lg:text-base">
          {text}
        </span>
      )}
    </div>
  );
};

/**
 * Custom hook to handle timer animation and calculation with shifting effect
 */
const useShiftingTimer = (unit, targetDate, timezone, isNegative) => {
  const [ref, animate] = useAnimate();
  const intervalRef = useRef(null);
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Initial calculation
    handleCountdown();
    
    // Set up interval
    intervalRef.current = setInterval(handleCountdown, 1000);
    
    // Cleanup
    return () => clearInterval(intervalRef.current || undefined);
  }, [targetDate, timezone]);

  const handleCountdown = async () => {
    if (!targetDate) return;

    const end = new Date(targetDate);
    const now = new Date();
    
    // Convert to timezone if specified
    const targetTime = timezone ? 
      new Date(end.toLocaleString('en-US', { timeZone: timezone })) : 
      end;
      
    const distance = targetTime - now;
    
    // If time is up, show zeros
    if (distance <= 0) {
      timeRef.current = 0;
      setTime(0);
      return;
    }
    
    let newTime = 0;
    
    if (unit === "Day") {
      newTime = Math.max(0, Math.floor(distance / DAY));
    } else if (unit === "Hour") {
      newTime = Math.max(0, Math.floor((distance % DAY) / HOUR));
    } else if (unit === "Minute") {
      newTime = Math.max(0, Math.floor((distance % HOUR) / MINUTE));
    } else {
      newTime = Math.max(0, Math.floor((distance % MINUTE) / SECOND));
    }

    // Only animate if the value changes
    if (newTime !== timeRef.current) {
      try {
        await animate(
          ref.current,
          { y: ["0%", "-50%"], opacity: [1, 0] },
          { duration: 0.35, ease: "easeInOut" }
        );
        
        timeRef.current = newTime;
        setTime(newTime);
        
        await animate(
          ref.current,
          { y: ["50%", "0%"], opacity: [0, 1] },
          { duration: 0.35, ease: "easeOut" }
        );
      } catch (error) {
        timeRef.current = newTime;
        setTime(newTime);
      }
    }
  };

  return { ref, time };
};