import React, { useEffect, useMemo, useState } from 'react';

const getTimeParts = (targetTime) => {
  const difference = targetTime.getTime() - Date.now();

  if (difference <= 0 || Number.isNaN(difference)) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const getTimerState = (startTime, endTime) => {
  const now = Date.now();
  const startMs = startTime.getTime();
  const endMs = endTime.getTime();

  // 1. Before Contest
  if (now < startMs) {
    return {
      title: 'Contest starts in',
      message: null,
      time: getTimeParts(startTime),
    };
  } 
  
  // 2. During Contest (Use >= to catch the exact start time)
  if (now >= startMs && now < endMs) {
    return {
      title: 'Contest ends in',
      message: null,
      time: getTimeParts(endTime), // Timer now counts down to the end time
    };
  }

  // 3. After Contest
  return {
    title: 'Contest ended',
    message: 'The contest has ended.',
    time: { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
  };
};

const TimerBox = ({ label, value }) => (
  <div className="w-[4.1rem] rounded-lg bg-slate-950 px-2 py-3 text-center shadow-lg shadow-sky-200/40 sm:w-[4.5rem]">
    <div className="font-mono text-xl font-black text-white sm:text-2xl">
      {String(value).padStart(2, '0')}
    </div>
    <div className="mt-1 text-[0.58rem] font-black uppercase tracking-widest text-sky-300">
      {label}
    </div>
  </div>
);

const CountdownTimer = () => {
  const [schedule, setSchedule] = useState(null);
  const [scheduleStatus, setScheduleStatus] = useState('loading');
  const [timerState, setTimerState] = useState({
    title: 'Loading contest timing',
    message: null,
    time: { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      try {
        const response = await fetch('/api/contest/dates');
        if (!response.ok) throw new Error('Unable to fetch contest dates');
        const data = await response.json();
        const nextSchedule = {
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
        };
        if (isMounted) {
          setSchedule(nextSchedule);
          setScheduleStatus('ready');
        }
      } catch (error) {
        if (isMounted) {
          setSchedule(null);
          setScheduleStatus('error');
        }
      }
    };

    fetchSchedule();
    const scheduleInterval = setInterval(fetchSchedule, 30000);
    return () => {
      isMounted = false;
      clearInterval(scheduleInterval);
    };
  }, []);

  useEffect(() => {
    if (!schedule) {
      setTimerState({
        title: scheduleStatus === 'error' ? 'Contest timing unavailable' : 'Loading contest timing',
        message: scheduleStatus === 'error' ? 'Please try again after a moment.' : null,
        time: { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
      });
      return undefined;
    }

    setTimerState(getTimerState(schedule.startTime, schedule.endTime));
    const interval = setInterval(() => {
      setTimerState(getTimerState(schedule.startTime, schedule.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule, scheduleStatus]);

  const boxes = useMemo(
    () => [
      ['Days', timerState.time.days],
      ['Hours', timerState.time.hours],
      ['Minutes', timerState.time.minutes],
      ['Seconds', timerState.time.seconds],
    ],
    [timerState]
  );

  return (
    <section className="flex flex-col items-center rounded-2xl bg-white/70 p-5 text-center shadow-xl shadow-sky-200/45 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-700">
        {timerState.title}
      </p>
      
      {/* Added justify-center here to center the boxes */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {boxes.map(([label, value]) => (
          <TimerBox key={label} label={label} value={value} />
        ))}
      </div>
      
      <p className="mt-4 text-sm font-bold text-slate-700">
        Date: 21 June 2026, 11:00 AM IST
      </p>
      
      {timerState.message && (
        <p className="mt-3 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white">
          {timerState.message}
        </p>
      )}
    </section>
  );
};

export default CountdownTimer;
