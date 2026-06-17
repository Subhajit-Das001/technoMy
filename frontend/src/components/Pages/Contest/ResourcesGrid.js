import React from 'react';

const resources = [
  ['PYQs', 'Previous year question papers', 'https://technothlon.techniche.org.in/pyp'],
  ['Technopedia', 'Concepts and preparation material', 'https://technothlon.techniche.org.in/technopedia-login'],
  ['Logic Week', 'Submit your answers and win eciting prizes', 'https://www.instagram.com/p/DZhwk7rj2T9/?img_index=1'],
];

const ResourcesGrid = () => (
  <section className="flex h-full flex-col rounded-2xl bg-white/70 p-5 shadow-xl shadow-sky-200/35 backdrop-blur lg:p-6">
    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-700">
      Prepare better
    </p>
    <h2 className="mt-1 text-xl font-extrabold text-sky-900 sm:text-2xl">
      Explore the resources
    </h2>

    {/* Increased top margin and gap (gap-3) to spread the items out */}
    <div className="mt-4 grid gap-3">
      {resources.map(([label, description, href]) => (
        <button
          key={label}
          type="button"
          onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
          // Increased internal padding (px-4 py-3.5) to make the buttons taller
          className="group flex items-center justify-between rounded-xl bg-sky-50/90 px-4 py-3.5 text-left shadow-sm shadow-sky-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:shadow-sky-200/50"
        >
          <span>
            {/* Scaled up the text sizes slightly (text-base and text-xs) */}
            <span className="block text-base font-extrabold text-slate-900">{label}</span>
            <span className="mt-0.5 block text-xs font-semibold text-slate-600">{description}</span>
          </span>
          <span className="ml-3 text-lg font-black text-sky-700 transition group-hover:translate-x-1">
            →
          </span>
        </button>
      ))}
    </div>
  </section>
);

export default ResourcesGrid;