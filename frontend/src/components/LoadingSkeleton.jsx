import React from 'react';

const LoadingSkeleton = ({ variant = 'cards' }) => {
  const Pulse = () => <div className="animate-pulse bg-slate-200 rounded"></div>;

  if (variant === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-1/3 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
              </div>
              <div className="w-1/2 h-8 bg-slate-200 rounded animate-pulse" />
              <div className="w-2/3 h-3.5 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-5 shadow-xs h-80 flex flex-col justify-between">
            <div className="w-1/4 h-5 bg-slate-200 rounded animate-pulse" />
            <div className="w-full h-56 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs h-80 flex flex-col justify-between">
            <div className="w-1/3 h-5 bg-slate-200 rounded animate-pulse" />
            <div className="w-full h-56 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'kanban') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)] overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-slate-100/70 border border-slate-200/50 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-2/3 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-6 h-6 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="flex-1 space-y-3 overflow-hidden">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-white border border-slate-250/60 rounded-lg p-3.5 space-y-3 shadow-xs">
                  <div className="w-1/2 h-3.5 bg-slate-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-1/3 h-3 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
          <div className="w-1/4 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-1/6 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-150 p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between pt-4 first:pt-0">
              <div className="w-1/3 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-1/4 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-1/6 h-5 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default 'cards' skeleton
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3 h-3 bg-slate-200 rounded animate-pulse" />
            <div className="w-16 h-5 bg-slate-200 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-5 bg-slate-200 rounded animate-pulse" />
            <div className="w-1/2 h-4 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-0.5 bg-slate-100" />
          <div className="flex items-center justify-between">
            <div className="w-1/3 h-3 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded bg-slate-200 animate-pulse" />
              <div className="w-6 h-6 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
