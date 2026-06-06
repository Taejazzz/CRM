import React from 'react';
import { useCRM } from '../context/CRMContext';
import { History, Calendar, PlusCircle, ArrowRightLeft, UserCheck, Trash2, Clock } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';

const ActivityFeedView = () => {
  const { activities, loading } = useCRM();

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

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in fade-in">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="font-display font-bold text-slate-805 text-base">CRM Activity Timeline</h3>
          </div>
          <span className="bg-slate-100 text-slate-655 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {activities.length} logs
          </span>
        </div>

        {activities.length > 0 ? (
          <div className="relative pl-6 border-l-2 border-slate-150 space-y-8 py-2">
            {activities.map((activity, index) => (
              <div key={activity._id || index} className="relative group">
                {/* Connector Node */}
                <div className="absolute -left-[37px] top-1.5 bg-white border-2 border-slate-150 group-hover:border-indigo-400 rounded-full p-1.5 transition-colors shadow-2xs">
                  {getActionIcon(activity.action)}
                </div>

                <div className="bg-white border border-slate-200 group-hover:border-indigo-300 hover:shadow-xs p-4 rounded-xl transition duration-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-405">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
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
          <div className="text-center py-16">
            <History className="w-10 h-10 text-slate-350 mx-auto mb-3 animate-pulse" />
            <h4 className="font-display font-bold text-slate-800">Timeline Empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Activity events will start populating as CRM leads are created, deleted, or transitioned between statuses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedView;
