import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipateButton from './ParticipateButton';
import ProfileDropdown from './ProfileDropdown';
import CountdownTimer from './CountdownTimer';
import Footer from './Footer';
// import Footer from '../../Footer/footer'
import PrizesSection from './PrizesSection';
import ResourcesGrid from './ResourcesGrid';
import ResultsCard from './ResultsCard';
import useAuthContext from '../../../hooks/useAuthContext';
const REGISTRATION_DISPLAY_OFFSET = 2000;

const useContestSchedule = () => {
   const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
  const [schedule, setSchedule] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      try {
        // const response = await fetch('/api/contest/dates');
        const response = await axios.get(`${baseURL}/api/contest/dates`)
        if (!response.ok) throw new Error('Unable to fetch contest dates');
        const data = await response.json();
        if (isMounted) {
          setSchedule({
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
          });
        }
      } catch (error) {
        if (isMounted) setSchedule(null);
      }
    };

    fetchSchedule();
    const scheduleInterval = setInterval(fetchSchedule, 30000);
    const clockInterval = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      isMounted = false;
      clearInterval(scheduleInterval);
      clearInterval(clockInterval);
    };
  }, []);

  return {
    schedule,
    isContestEnded: schedule ? now > schedule.endTime.getTime() : false,
  };
};

const useContestStats = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
  const [registeredCount, setRegisteredCount] = useState(null);
  const [statsStatus, setStatsStatus] = useState('loading');

useEffect(() => {
  let mounted = true;

  const fetchStats = async (showSkeleton = false) => {
    try {
      if (showSkeleton) {
        setStatsStatus('loading');
      }

      const { data } = await axios.get(
        `${baseURL}/api/contest/stats`
      );

      if (!mounted) return;

      setRegisteredCount(data?.totalStudents ?? 0);
      setStatsStatus('success');
    } catch (error) {
      if (!mounted) return;

      console.error('Mega Contest stats error:', error);
      setStatsStatus('error');
    }
  };

  fetchStats(true);

  const interval = setInterval(fetchStats, 30000);

  return () => {
    mounted = false;
    clearInterval(interval);
  };
}, [baseURL]);

  const countText = useMemo(() => {
    if (statsStatus === 'error') return 'Registration count unavailable';
    if (registeredCount === null) return '';
    return `${(registeredCount + REGISTRATION_DISPLAY_OFFSET).toLocaleString('en-IN')} Students`;
  }, [registeredCount, statsStatus]);

  return { countText, statsStatus };
};

const StatsBlock = ({ countText, statsStatus }) => (
  <div className="flex justify-center lg:justify-end">
    {statsStatus === "loading" ? (
      <div className="h-12 w-56 animate-pulse rounded-full bg-sky-100" />
    ) : (
      <div
        className="
          inline-flex items-center gap-3
          rounded-full
          border border-sky-100
          bg-white/80
          px-5 py-3
          shadow-md
          backdrop-blur-sm
        "
      >
        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-600">
            Live Registrations
          </span>

          <span
            className={`text-sm font-extrabold ${
              statsStatus === "error"
                ? "text-rose-600"
                : "text-slate-700"
            }`}
          >
            {countText}
          </span>
        </div>
      </div>
    )}
  </div>
);
// Paste the new hook here:
const useResultsData = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";
  const [resultsState, setResultsState] = useState({
    showResults: false,
    hasAttempted: false,
    data: null,
    loading: true
  });

  useEffect(() => {
    let mounted = true;

    const checkResults = async () => {
      try {
        const phone = localStorage.getItem('userPhone');
        
        // Ensure phone isn't a literal string of "null" or "undefined"
        const isValidPhone = phone && phone !== 'null' && phone !== 'undefined';

        // Direct traffic: Logged out users go to public route, logged in go to private
        const url = isValidPhone 
          ? `${baseURL}/api/contest/my-results?phone=${encodeURIComponent(phone)}`
          : `${baseURL}/api/contest/results-status`; 

        const { data } = await axios.get(url);
        
        if (mounted) {
          setResultsState({
            showResults: data.showResults || false,
            hasAttempted: data.hasAttempted || false,
            data: data.data || null,
            loading: false
          });
        }
      } catch (error) {
        console.error("Failed to fetch primary results route, attempting fallback:", error);
        
        // FALLBACK: If the private route failed (e.g. auth error), still try to check if results are live globally
        try {
            const fallbackRes = await axios.get(`${baseURL}/api/contest/results-status`);
            if (mounted) {
                setResultsState({
                    showResults: fallbackRes.data.showResults || false,
                    hasAttempted: false,
                    data: null,
                    loading: false
                });
            }
        } catch (fallbackError) {
            if (mounted) setResultsState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    checkResults();
  }, [baseURL]);

  return resultsState;
};
const AboutTechnothlon = ({ isContestEnded = false }) => (
  <section className="flex h-full flex-col rounded-2xl bg-white/70 p-5 shadow-xl  backdrop-blur lg:p-6">
    <div>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-700">
        Know the platform
      </p>
      <h2 className="mt-1 text-xl font-extrabold text-sky-900 sm:text-2xl">
        About Technothlon
      </h2>
      
      <div className="mt-2.5 space-y-2 text-sm font-medium leading-snug text-slate-800">
        <p>
          Organized by the student fraternity of IIT Guwahati, Technothlon is an International School Championship built for students who love <span className="font-bold text-sky-800">logic-heavy puzzles</span> over standard memorization.
        </p>
        {/* <p>
          The <span className="font-bold text-sky-800">Mega Contest</span> is your launchpad. Try our unique questions, unlock preparation resources, and gear up for the main championship.
        </p> */}
      </div>
    </div>

    {/* Increased padding (pt-5) and massively bulked up the button itself */}
    <div className="mt-auto pt-5">
      <button
        type="button"
        onClick={() => {
          if (!isContestEnded) {
            window.open('https://technothlon.techniche.org.in/TeamRegistration', '_blank', 'noopener,noreferrer');
          }
        }}
        disabled={isContestEnded}
        // Scaled up to px-6 py-3.5 and text-sm for a much stronger presence
        className={`group flex w-fit items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition-all ${
          isContestEnded
            ? 'cursor-not-allowed bg-slate-300 text-slate-500'
            : 'bg-sky-900 text-white shadow-lg shadow-sky-900/30 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-sky-900/40'
        }`}
      >
        {isContestEnded ? 'Registration Closed' : 'Register for Technothlon 2026'}
        {!isContestEnded && <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>}
      </button>
    </div>
  </section>
);
// Replace this entire block:
const RegisterCta = ({ isContestEnded, showResults }) => {
  const navigate = useNavigate();
  
  // FIX: Force results phase to true if `showResults` is true, 
  // completely ignoring what the timer (`isContestEnded`) says.
  const isResultsPhase = showResults;

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-blue-100 p-6 text-center shadow-xl shadow-sky-300/25 backdrop-blur">
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-sky-300/25 blur-2xl" />
      <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-blue-300/20 blur-2xl" />
      
      <p className="relative mb-2 text-xs font-black uppercase tracking-[0.28em] text-sky-700">
        {isResultsPhase ? 'The Wait is Over' : 'Dream Beyond Earth'}
      </p>
      <h2 className="relative text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
        {isResultsPhase ? 'Contest Results are ' : 'Win Your Way to an '}
        <span className={isResultsPhase ? "block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent" : "block bg-gradient-to-r from-sky-700 via-blue-700 to-cyan-600 bg-clip-text text-transparent"}>
          {isResultsPhase ? 'LIVE' : 'ISRO Trip'}
        </span>
      </h2>
      
      <p className="relative mt-2 text-sm font-semibold text-slate-600">
        {isResultsPhase 
          ? '✅Login to view your performance report and rank.' 
          : isContestEnded 
            ? 'Registration for Mega Contest is now closed.'
            : 'Register for Mega Contest and compete for exciting rewards.'}
      </p>

      <button
        type="button"
        onClick={() => {
          if (isResultsPhase || !isContestEnded) navigate('/contest/login');
        }}
        disabled={isContestEnded && !isResultsPhase}
        className={`relative mt-6 rounded-2xl px-10 py-4 text-base font-black uppercase tracking-widest shadow-xl transition ${
          isResultsPhase
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-400/25 hover:-translate-y-1 hover:from-emerald-400 hover:to-green-500'
            : isContestEnded
              ? 'cursor-not-allowed bg-slate-400 text-white shadow-slate-300/25'
              : 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-blue-400/25 hover:-translate-y-1 hover:from-sky-500 hover:to-blue-600'
        }`}
      >
        {isResultsPhase ? 'CHECK YOUR RESULTS' : isContestEnded ? 'Registration Closed' : 'Register Now'}
      </button>
    </section>
  );
};

const InstructionsSection = () => {
const instructions = [
  'Attempt the contest individually.',
  'Verify your details before starting.',
  'Complete the contest in one sitting.',
  "Do not refresh the page; only one attempt is allowed.",
  'Do not switch tabs or leave the browser window.',
  'AI tools and multiple-device access are prohibited.',
  'A stable internet connection is strongly recommended.',
  'Violation of any rule may result in disqualification.',
  'Results will be announced on this portal.',
  'The organizing team\'s decision is final.',
];

  return (
    <section className="rounded-2xl bg-white/70 p-5 shadow-xl shadow-sky-200/35 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.22em] text-sky-700">
        Before you begin
      </p>
      <h2 className="mt-2 text-2xl font-black text-sky-900">
        📋 Instructions for the Contest
      </h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {instructions.map((instruction, index) => (
          <div
            key={instruction}
            className="rounded-xl bg-sky-50/90 px-4 py-3 text-sm font-bold leading-6 text-slate-900 shadow-sm shadow-sky-100"
          >
            <span className="mr-2 font-black text-sky-700">{index + 1}.</span>
            {instruction}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs italic text-slate-600">
        * Instructions subject to change.
      </p>
    </section>
  );
};

const PageShell = ({ children, headerRight }) => (
  // Added flex and flex-col to easily push the footer to the bottom
  <div className="relative flex min-h-screen flex-col bg-sky-50 text-slate-950">
    
    {/* MOVED BACKGROUNDS HERE so they cover the entire screen, including the footer */}
    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.24),transparent_36%),linear-gradient(135deg,#f8fbff_0%,#e0f2fe_48%,#bfdbfe_100%)]" />
    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(14,116,144,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.055)_1px,transparent_1px)] bg-[size:55px_55px]" />

    {/* flex-grow allows the main content to expand, keeping footer at the bottom */}
    <main className="relative z-10 flex-grow px-3 pb-5 sm:px-5 sm:pb-8 lg:px-8 lg:pb-10">
      
      {/* Kept your exact adjusted margins/paddings from previous step */}
      <section className="relative mx-auto mt-4 w-full max-w-7xl rounded-3xl bg-white/38 px-4 pb-4 pt-5 shadow-2xl shadow-sky-300/35 backdrop-blur-xl sm:px-6 sm:pb-6 sm:pt-6 lg:px-8 lg:pb-8 lg:pt-6">
        
        <header className="grid gap-4 pb-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <h1 className="text-4xl font-black uppercase tracking-[0.18em] text-slate-950 sm:text-6xl lg:text-7xl">
            Mega Contest
          </h1>
          <div className="grid gap-3 lg:min-w-[20rem]">{headerRight}</div>
        </header>

        {children}
      </section>
    </main>
    
    {/* Footer wrapper */}
    <div className="relative z-10">
      <Footer />
    </div>
  </div>
);
export const BeforeRegistration = ({ countText, statsStatus, isContestEnded, showResults }) => (
  <PageShell headerRight={<StatsBlock countText={countText} statsStatus={statsStatus} />}>
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.66fr)]">
        <PrizesSection />
        <aside className="grid gap-5">
          <CountdownTimer />
          
          <RegisterCta isContestEnded={isContestEnded} showResults={showResults} />
          
        </aside>
      </section>
      <section className="grid items-stretch gap-5 lg:grid-cols-2">
        <AboutTechnothlon isContestEnded={isContestEnded} />
        <ResourcesGrid />
      </section>
    </div>
  </PageShell>
);

// Modify the props and replace <InstructionsSection /> with the conditional logic:
export const AfterRegistration = ({ countText, statsStatus, isContestEnded, schedule, resultsState }) => (
  <PageShell
    headerRight={
      <div className="relative flex items-center gap-4 z-[9999]">
        <div className="relative z-0">
          <StatsBlock countText={countText} statsStatus={statsStatus} />
        </div>
        <div className="relative z-50 shrink-0">
          <ProfileDropdown />
        </div>
      </div>
    }
  >
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.66fr)]">
        
        {/* Replace your old <InstructionsSection /> with this: */}
        {resultsState.showResults && resultsState.hasAttempted ? (
          <ResultsCard results={resultsState.data} />
        ) : (
          <InstructionsSection />
        )}

        <aside className="grid gap-5">
          <CountdownTimer />
          
          {/* Update this component call to pass the prop */}
          <ParticipateButton
            contestStartTime={schedule?.startTime}
            contestEndTime={schedule?.endTime}
            showResults={resultsState.showResults}
          />
          
        </aside>
      </section>
      <section className="grid items-stretch gap-5 lg:grid-cols-2">
        <AboutTechnothlon isContestEnded={isContestEnded} />
        <ResourcesGrid />
      </section>
    </div>
  </PageShell>
);
// Replace the main MegaContest block:
const MegaContest = ({ registrationState }) => {
  const { isAuthenticated } = useAuthContext();
  const { countText, statsStatus } = useContestStats();
  const { schedule, isContestEnded } = useContestSchedule();
  
  // Add the hook initialization here:
  const resultsState = useResultsData();

  // Update the return statements to pass the new props:
  if (registrationState === 'beforeRegistration' || !isAuthenticated) {
    return (
      <BeforeRegistration
        countText={countText}
        statsStatus={statsStatus}
        isContestEnded={isContestEnded}
        showResults={resultsState.showResults}
      />
    );
  }

  return (
    <AfterRegistration
      countText={countText}
      statsStatus={statsStatus}
      isContestEnded={isContestEnded}
      schedule={schedule}
      resultsState={resultsState}
    />
  );
};

export default MegaContest;
