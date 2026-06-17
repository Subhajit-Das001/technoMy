import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getPhase = (contestStartTime, contestEndTime) => {
  if (!contestStartTime || !contestEndTime) return 'unavailable';
  const now = Date.now();
  if (now < contestStartTime.getTime()) return 'before';
  if (now > contestEndTime.getTime()) return 'ended';
  return 'live';
};

const ParticipateButton = ({ contestStartTime, contestEndTime, isContestActive = null ,showResults = false}) => {
  const navigate = useNavigate();
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";

  const [contestWindow, setContestWindow] = useState({ startTime: contestStartTime, endTime: contestEndTime });
  const [phase, setPhase] = useState(() => getPhase(contestStartTime, contestEndTime));
  const [activeStatus, setActiveStatus] = useState(isContestActive);
  const [scheduleStatus, setScheduleStatus] = useState('loading');
  const [attemptStatus, setAttemptStatus] = useState({ isStarted: false, isCompleted: false });

  // Get user phone to determine if they are logged in
  const phone = localStorage.getItem('userPhone');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(getPhase(contestWindow.startTime, contestWindow.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [contestWindow]);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        // 1. Fetch Dates
        const datesResponse = await fetch(`${baseURL}/api/contest/dates`);
        if (datesResponse.ok) {
          const dates = await datesResponse.json();
          if (isMounted) {
            setContestWindow({
              startTime: new Date(dates.startTime),
              endTime: new Date(dates.endTime),
            });
            setScheduleStatus('ready');
          }
        } else {
          throw new Error('Unable to load contest dates');
        }
      } catch (error) {
        if (isMounted) {
          setContestWindow({ startTime: null, endTime: null });
          setScheduleStatus('error');
        }
      }

      // 2. Fetch Active Status
      if (typeof isContestActive === 'boolean') {
        setActiveStatus(isContestActive);
      } else {
        try {
          const response = await fetch(`${baseURL}/api/contest/status`);
          if (response.ok) {
            const data = await response.json();
            if (isMounted) setActiveStatus(data.isContestActive);
          }
        } catch (error) {
          if (isMounted) setActiveStatus(false);
        }
      }

      // 3. Fetch Attempt Status (Only if logged in)
      if (phone) {
        try {
          const scoreResponse = await fetch(`${baseURL}/api/contest/score?phone=${encodeURIComponent(phone)}`);
          if (scoreResponse.ok) {
            const scoreData = await scoreResponse.json();
            if (isMounted) {
              setAttemptStatus({
                isStarted: Boolean(scoreData.isStarted),
                isCompleted: Boolean(scoreData.isCompleted),
              });
            }
          }
        } catch (error) {
          if (isMounted) setAttemptStatus({ isStarted: false, isCompleted: false });
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [contestEndTime, contestStartTime, isContestActive, phone, baseURL]);

  // Determine exactly what the button should do and say
  const buttonState = useMemo(() => {
    // Priority 1: Loading / Error
    if (scheduleStatus === 'error' || phase === 'unavailable') {
      return { disabled: true, label: 'Timing Unavailable', status: 'Please refresh after a moment.', route: null ,isGreen: false};
    }
    if (showResults) {
      if (!phone) {
        return { disabled: false, label: 'CHECK YOUR RESULTS', status: '✅ Results are live!', route: '/contest/login', isGreen: true };
      } else {
        return { disabled: false, label: 'VIEW LEADERBOARD', status: '🏆 See where you stand', route: '/leaderboard', isGreen: true };
      }
    }
    // if (phase === 'ended' && showResults) {
    //   if (!phone) {
    //     return { disabled: false, label: 'CHECK YOUR RESULTS', status: '✅ Results are live!', route: '/contest/login', isGreen: true };
    //   } else {
    //     // If logged in, ResultsCard is shown on the left, so button guides to Leaderboard
    //     return { disabled: false, label: 'VIEW LEADERBOARD', status: '🏆 See where you stand', route: '/leaderboard', isGreen: true };
    //   }
    // }

    // Priority 2: Contest Ended universally
    if (phase === 'ended') {
      return { disabled: true, label: 'Contest Has Ended', status: '🔒 Contest has ended. Thank you for participating.', route: null, isGreen: false  };
    }

    // Priority 3: User is NOT logged in
    if (!phone) {
      if (phase === 'before') {
        return { disabled: false, label: 'REGISTER NOW', status: '📝 Register before the contest starts', route: '/contest/login', isGreen: false  };
      }
      return { disabled: false, label: 'LOGIN TO COMPETE', status: '🚀 Contest is live!', route: '/contest/login', isGreen: false  };
    }

    // Priority 4: User is Logged In
    if (attemptStatus.isCompleted) {
      return { disabled: true, label: 'SUBMITTED', status: '✅ Your contest attempt is already submitted.', route: null, isGreen: false  };
    }

    if (phase === 'live' && activeStatus !== false) {
      // if (attemptStatus.isStarted) {
      //   return { disabled: false, label: 'RESUME CONTEST 🚀', status: '⚠️ Your contest is in progress.', route: '/contest/arena' };
      // }
      return { disabled: false, label: 'PARTICIPATE NOW ', status: '✅ Contest is LIVE - Good luck!', route: '/contest/arena', isGreen: false  };
    }

    // Priority 5: Logged in, but contest hasn't started yet
    return { disabled: true, label: 'CONTEST NOT STARTED YET', status: '⏳ Arena unlocks when countdown reaches zero', route: null, isGreen: false  };

  }, [phone, activeStatus, attemptStatus, phase, scheduleStatus,showResults]);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-blue-100 p-6 text-center shadow-xl shadow-sky-300/25 backdrop-blur">
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-sky-300/25 blur-2xl" />
      <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-blue-300/20 blur-2xl" />
      <p className="relative mb-2 text-xs font-black uppercase tracking-[0.28em] text-sky-700">
        Ready to Compete
      </p>
      <h2 className="relative text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
        Start Your Contest
        <span className="block bg-gradient-to-r from-sky-700 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
          Journey 🚀
        </span>
      </h2>
      <p className="relative mt-2 text-sm font-semibold text-slate-600">
        Arena unlocks when countdown reaches zero.
      </p>
      <button
        type="button"
        disabled={buttonState.disabled}
        onClick={() => {
          if (buttonState.route) navigate(buttonState.route);
        }}
        className={`relative mt-6 rounded-2xl px-10 py-4 text-base font-black uppercase tracking-widest text-white shadow-xl transition ${
          buttonState.disabled
            ? 'cursor-not-allowed bg-slate-400 shadow-slate-300/25'
            : buttonState.isGreen 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-400/25 hover:-translate-y-1 hover:from-emerald-400 hover:to-green-500'
              : 'bg-gradient-to-r from-sky-600 to-blue-700 shadow-blue-400/25 hover:-translate-y-1 hover:from-sky-500 hover:to-blue-600'
        }`}
      >
        {buttonState.label}
      </button>
      <p className="relative mt-3 text-sm font-bold text-slate-600">{buttonState.status}</p>
    </section>
  );
};

export default ParticipateButton;