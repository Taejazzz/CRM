import React from 'react';
import { useCRM } from '../context/CRMContext';
import LoadingSkeleton from './LoadingSkeleton';
import {
  Users,
  Compass,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f43f5e', '#f59e0b', '#64748b'];

const DashboardView = () => {
  const { stats, activities, loading, setCurrentView } = useCRM();

  if (loading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  // Format Recharts source distribution data
  const chartSourceData = stats.sourceAnalytics?.map((item) => ({
    name: item.source || 'Other',
    value: item.count || 0,
  })) || [];

  // Funnel Stage Data
  const chartFunnelData = stats.funnel?.map((item) => ({
    stage: item.name,
    Leads: item.count,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leads */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">{stats.totalLeads}</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>All time records</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Leads */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pipeline</span>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">{stats.activeLeads}</h3>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold mt-1">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>In-progress negotiations</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50/50 flex items-center justify-center text-indigo-505 shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* Converted Leads */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Converted</span>
            <h3 className="text-3xl font-display font-extrabold text-slate-850">{stats.convertedLeads}</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <span>{stats.conversionRate}% conversion rate</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Lost Leads */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost Leads</span>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">{stats.lostLeads}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <span>Closed unresolved</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Advanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion rate</span>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black">{stats.conversionRate}%</span>
              <span className="text-xs text-indigo-300 font-medium">Goal: 25%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, stats.conversionRate)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Growth</span>
            {stats.monthlyGrowthPercentage >= 0 ? (
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 flex items-center gap-0.5 text-xs font-bold">
                <ArrowUpRight className="w-4 h-4" />
                {stats.monthlyGrowthPercentage}%
              </span>
            ) : (
              <span className="p-1 rounded-md bg-rose-50 text-rose-600 flex items-center gap-0.5 text-xs font-bold">
                <ArrowDownRight className="w-4 h-4" />
                {stats.monthlyGrowthPercentage}%
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <h4 className="text-2xl font-display font-extrabold text-slate-805">
              {stats.monthlyGrowthPercentage >= 0 ? '+' : ''}
              {stats.monthlyGrowthPercentage}%
            </h4>
            <p className="text-xs text-slate-500 font-medium">New leads compared to the previous month.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Health</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-display font-extrabold text-slate-800">{stats.pipelineHealth}%</span>
              <span className="text-xs text-slate-500 font-semibold">Qualified / Converted leads</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.pipelineHealth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="mb-4">
            <h4 className="font-display font-bold text-slate-800 text-sm">Lead Funnel Distribution</h4>
            <p className="text-xs text-slate-500">Volume of pipeline leads grouped by progress stage</p>
          </div>
          <div className="h-64 flex-1">
            {chartFunnelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="Leads" fill="#6366f1" radius={[6, 6, 0, 0]}>
                    {chartFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400 font-medium">
                No pipeline data available.
              </div>
            )}
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="mb-4">
            <h4 className="font-display font-bold text-slate-800 text-sm">Lead Source Distribution</h4>
            <p className="text-xs text-slate-500">Percentage distribution of lead sources</p>
          </div>
          <div className="h-64 flex-1 relative flex flex-col justify-center">
            {chartSourceData.length > 0 ? (
              <>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-16 overflow-y-auto px-2">
                  {chartSourceData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate font-medium">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400 font-medium">
                No source data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Feed in Dashboard */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-display font-bold text-slate-805 text-sm">Real-time Activity Feed</h4>
            <p className="text-xs text-slate-500">Instant updates of lead adjustments and pipelines</p>
          </div>
          <button
            onClick={() => setCurrentView('feed')}
            className="text-xs text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-0.5"
          >
            View all history
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
          {activities.length > 0 ? (
            activities.slice(0, 5).map((act) => {
              let badgeColor = 'bg-slate-100 text-slate-700';
              if (act.action === 'Created') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100 border';
              if (act.action === 'Status Change') badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100 border';
              if (act.action === 'Deleted') badgeColor = 'bg-rose-50 text-rose-700 border-rose-100 border';

              return (
                <div key={act._id} className="flex items-start justify-between gap-4 text-xs">
                  <div className="flex gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold shrink-0 text-[10px] uppercase h-5 flex items-center justify-center ${badgeColor}`}>
                      {act.action}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-slate-700 font-medium leading-relaxed">{act.details}</p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-sm text-slate-400 font-medium">
              No recent activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
