import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatBox = ({ label, value, colorClass, isLarge = false }) => (
  <div className={`flex flex-col justify-center rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm ${isLarge ? 'p-5 sm:p-6' : 'p-4'}`}>
    <span className={`font-bold uppercase tracking-widest text-slate-400 ${isLarge ? 'text-xs' : 'text-[10px]'}`}>
      {label}
    </span>
    <span className={`mt-1 font-black ${colorClass} ${isLarge ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>
      {value}
    </span>
  </div>
);

const ResultsCard = ({ results }) => {
  const navigate = useNavigate();

  if (!results) return null;

  return (
    // h-full and flex-col stretch the card to match the right column's height
    <section className="relative flex h-full flex-col rounded-3xl bg-slate-900 p-6 shadow-2xl shadow-sky-900/20 overflow-hidden sm:p-8">
      {/* Background visual accents */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
      
      {/* Subtle grid pattern for technical aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-slate-700/60 pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
            Contest Analysis
          </p>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Performance Overview
          </h2>
        </div>
        
        {/* Rank Badge */}
        <div className="flex flex-col items-end justify-center rounded-2xl bg-slate-800/80 px-5 py-3 border border-slate-700/80 shadow-inner">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Global Rank</p>
          <p className="text-3xl font-black text-emerald-400 sm:text-4xl">#{results.rank}</p>
        </div>
      </div>

      {/* Main Stats Area - flex-grow forces this to take up available vertical space */}
      <div className="relative z-10 mt-6 flex flex-col flex-grow justify-center gap-4">
        
        {/* Top Row: Emphasized Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Total Score" value={results.totalScore} colorClass="text-sky-400" isLarge={true} />
          <StatBox label="Accuracy" value={`${results.accuracy}%`} colorClass="text-purple-400" isLarge={true} />
        </div>
        
        {/* Bottom Row: Breakdown */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <StatBox label="Attempted" value={results.attempted} colorClass="text-white" />
          <StatBox label="Correct" value={results.correct} colorClass="text-emerald-400" />
          <StatBox label="Incorrect" value={results.incorrect} colorClass="text-rose-400" />
        </div>

      </div>

      {/* Bottom Button - mt-auto pushes this to the absolute bottom edge of the container */}
      <button
        onClick={() => navigate('/leaderboard')}
        className="relative z-10 mt-auto pt-6 w-full group"
      >
        <div className="flex w-full items-center justify-center rounded-xl bg-slate-800 py-4 text-sm font-bold uppercase tracking-widest text-slate-300 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-emerald-400 border border-slate-700 group-hover:border-emerald-500/50 shadow-md">
          View Full Leaderboard <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </button>
    </section>
  );
};

export default ResultsCard;