import React from 'react';

const remainingPrizes = [
  ['Rank 1-5', '100%'],
  ['Rank 6-20', '75%'],
  ['Rank 21-50', '50%'],
  ['Rank 51-100', '25%'],
];

const Medal = ({ rank, label, scholarship, className, medalClass }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl font-black shadow-lg sm:h-20 sm:w-20 ${medalClass}`}>
      {rank}
    </div>
    <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-700">{label}</p>
    <p className="text-lg font-black text-sky-800">{scholarship}</p>
  </div>
);

const PrizesSection = () => (
  <section className="relative h-full w-full overflow-hidden rounded-2xl bg-white/72 p-5 shadow-xl shadow-sky-200/45 backdrop-blur">
    <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_12%_18%,#facc15_0_15px,transparent_16px),radial-gradient(circle_at_40%_34%,#14b8a6_0_17px,transparent_18px),radial-gradient(circle_at_76%_20%,#f97316_0_18px,transparent_19px),radial-gradient(circle_at_88%_70%,#38bdf8_0_17px,transparent_18px)] [background-size:140px_140px]" />
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/92 via-white/90 to-blue-100/86" />

    <div className="relative">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-700">
          Winners Podium
        </p>
        <h2 className="mt-1 text-2xl font-black text-sky-900">
          Exciting Prizes for Top-3 Winners
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-3 items-end gap-2 sm:gap-4">
        <div>
          <Medal
            rank="2"
            label="Silver"
            scholarship="100%"
            className="translate-y-4"
            medalClass="bg-gradient-to-br from-white via-slate-200 to-slate-300 text-slate-700"
          />
          <div className="mx-auto mt-4 h-14 rounded-t-xl bg-gradient-to-br from-sky-200 to-blue-200 shadow-sm sm:h-20" />
        </div>

        <div>
          <Medal
            rank="1"
            label="Gold"
            scholarship="100%"
            className="-translate-y-5"
            medalClass="bg-gradient-to-br from-yellow-100 via-yellow-300 to-amber-400 text-amber-900"
          />
          <div className="mx-auto h-24 rounded-t-xl bg-gradient-to-br from-sky-300 to-blue-300 shadow-sm sm:h-32" />
        </div>

        <div>
          <Medal
            rank="3"
            label="Bronze"
            scholarship="100%"
            className="translate-y-7"
            medalClass="bg-gradient-to-br from-orange-100 via-orange-300 to-orange-500 text-orange-950"
          />
          <div className="mx-auto mt-7 h-12 rounded-t-xl bg-gradient-to-br from-sky-200 to-blue-200 shadow-sm sm:h-16" />
        </div>
      </div>

      <div className="mt-5 grid gap-2 rounded-2xl bg-white/55 p-3 shadow-sm shadow-sky-100 sm:grid-cols-4">
        {remainingPrizes.map(([rank, scholarship]) => (
          <div key={rank} className="rounded-xl bg-white/80 px-3 py-2 text-center">
            <p className="text-xs font-black text-slate-700">{rank}</p>
            <p className="text-lg font-black text-sky-700">{scholarship}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs italic font-semibold text-slate-600">
        Discount vouchers on Technothlon Registration fees.
      </p>
    </div>
  </section>
);

export default PrizesSection;
