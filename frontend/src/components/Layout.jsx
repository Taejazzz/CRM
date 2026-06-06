import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  LayoutDashboard,
  KanbanSquare,
  LayoutGrid,
  List,
  History,
  Plus,
  Search,
  Filter,
  Menu,
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import LeadModal from './LeadModal';

const Layout = ({ children }) => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    notification,
    activities,
    loading,
  } = useCRM();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Trigger glowing unread dot when new activities are pushed via Socket.IO
  useEffect(() => {
    if (!loading && activities.length > 0 && !isNotificationsOpen) {
      setHasUnread(true);
    }
  }, [activities, loading]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Pipeline Board', icon: KanbanSquare },
    { id: 'cards', label: 'Card Grid', icon: LayoutGrid },
    { id: 'compact', label: 'Compact List', icon: List },
    { id: 'feed', label: 'Activity Logs', icon: History },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f3ec] text-slate-800 antialiased font-sans">
      {/* Toast Notifications */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white border border-slate-100 shadow-2xl rounded-xl px-4 py-3 border-l-4 border-l-indigo-600 animate-bounce">
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
          {notification.type === 'info' && <Info className="w-5 h-5 text-indigo-500" />}
          <span className="text-sm font-semibold text-slate-700">{notification.message}</span>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-100/90 text-slate-700 border-r border-slate-200 shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-slate-800 text-lg tracking-wide">
              LeadFlow
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-650 font-bold border-l-4 border-l-indigo-600 rounded-l-none'
                    : 'hover:bg-slate-200/50 hover:text-slate-900 text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-650' : 'text-slate-400 group-hover:text-slate-700'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>


      </aside>

      {/* Mobile Drawer Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />

          {/* Drawer body */}
          <aside className="relative flex flex-col w-64 bg-slate-100 text-slate-700 border-r border-slate-200 z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-slate-800 text-lg tracking-wide">
                  LeadFlow
                </span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-450 hover:text-slate-750">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-650 font-bold border-l-4 border-l-indigo-600 rounded-l-none'
                        : 'hover:bg-slate-200/50 hover:text-slate-900 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>


          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-950"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Global search if on leads views */}
            {currentView !== 'dashboard' && currentView !== 'feed' ? (
              <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            ) : (
              <div className="font-display font-bold text-lg text-slate-800 hidden md:block">
                {currentView === 'dashboard' ? 'Analytics Command Dashboard' : 'System Activity Timeline'}
              </div>
            )}
          </div>

          {/* Quick controls / Filter dropdowns / Add Lead CTAs */}
          <div className="flex items-center gap-4">
            {/* View filters logic */}
            {currentView !== 'dashboard' && currentView !== 'feed' && (
              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="hidden sm:block border border-slate-200 bg-white text-xs font-semibold text-slate-600 px-3 py-2 rounded-lg hover:border-slate-350 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>

                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="hidden sm:block border border-slate-200 bg-white text-xs font-semibold text-slate-600 px-3 py-2 rounded-lg hover:border-slate-350 focus:outline-none"
                >
                  <option value="All">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Partner">Partner</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Action CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setHasUnread(false);
                }}
                className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 border-2 border-white rounded-full"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-20 animate-fade-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-display font-bold text-slate-800 text-sm">System Alerts</span>
                      <button
                        onClick={() => {
                          setCurrentView('feed');
                          setIsNotificationsOpen(false);
                        }}
                        className="text-[10px] text-indigo-650 hover:underline font-bold"
                      >
                        View Timeline
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {activities.length > 0 ? (
                        activities.slice(0, 5).map((act, index) => (
                          <div key={act._id || index} className="px-4 py-3 hover:bg-slate-50 transition text-xs text-left">
                            <p className="text-slate-700 font-semibold leading-relaxed">{act.details}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                              {new Date(act.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-slate-450 text-xs font-semibold">
                          No alerts recorded.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Sub Header for Mobile Search & Filter */}
        {currentView !== 'dashboard' && currentView !== 'feed' && (
          <div className="bg-white border-b border-slate-200 px-6 py-3 md:hidden space-y-2 flex flex-col">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 border border-slate-200 bg-white text-xs font-semibold text-slate-600 p-2 rounded-lg"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="flex-1 border border-slate-200 bg-white text-xs font-semibold text-slate-600 p-2 rounded-lg"
              >
                <option value="All">All Sources</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Partner">Partner</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* View Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Add Lead Modal Overlay */}
      {isModalOpen && (
        <LeadModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
