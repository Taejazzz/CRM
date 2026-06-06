import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { History, Calendar, PlusCircle, ArrowRightLeft, UserCheck, Trash2, Clock, Search, X } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';

const ActivityFeedView = () => {
  const { activities, loading } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return <LoadingSkeleton variant="compact" />;
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'Created':
        return <PlusCircle className="w-5 h-5 text-emerald-500" />;
      case 'Status Change':
        return <ArrowRightLeft className="w-5 h-5 text-indigo-500" />;
      case 'Updated':
        return <UserCheck className="w-5 h-5 text-sky-500" />;
      case 'Deleted':
        return <Trash2 className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'Created':     return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Status Change': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Updated':     return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Deleted':     return 'bg-rose-50 text-rose-700 border-rose-200';
      default:            return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredActivities = q
    ? activities.filter(
        (a) =>
          (a.leadName && a.leadName.toLowerCase().includes(q)) ||
          (a.action && a.action.toLowerCase().includes(q)) ||
          (a.details && a.details.toLowerCase().includes(q))
      )
    : activities;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in fade-in">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="font-display font-bold text-slate-800 text-base">CRM Activity Timeline</h3>
          </div>
          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {filteredActivities.length} / {activities.length} logs
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by lead name, action, or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Activity List */}
        {filteredActivities.length > 0 ? (
          <div className="relative pl-6 border-l-2 border-slate-150 space-y-8 py-2">
            {filteredActivities.map((activity, index) => (
              <div key={activity._id || index} className="relative group">
                {/* Connector Node */}
                <div className="absolute -left-[37px] top-1.5 bg-white border-2 border-slate-150 group-hover:border-indigo-400 rounded-full p-1.5 transition-colors shadow-2xs">
                  {getActionIcon(activity.action)}
                </div>

                <div className="bg-white border border-slate-200 group-hover:border-indigo-300 hover:shadow-xs p-4 rounded-xl transition duration-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full border ${getActionBadgeColor(activity.action)}`}>
                      {activity.action}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                    {activity.details}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Target Lead: {activity.leadName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="w-9 h-9 text-slate-300 mx-auto mb-3" />
                <h4 className="font-display font-bold text-slate-700">No results found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  No activity matches "<span className="font-semibold text-slate-500">{searchQuery}</span>". Try a different search term.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <History className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <h4 className="font-display font-bold text-slate-800">Timeline Empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Activity events will start populating as CRM leads are created, deleted, or transitioned between statuses.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedView;
