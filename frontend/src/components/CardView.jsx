import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Inbox,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import LeadModal from './LeadModal';
import LoadingSkeleton from './LoadingSkeleton';

export const STATUS_COLORS = {
  New: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Contacted: 'bg-sky-50 text-sky-700 border-sky-200',
  Qualified: 'bg-amber-50 text-amber-700 border-amber-200',
  Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lost: 'bg-rose-50 text-rose-700 border-rose-200',
};

const CardView = () => {
  const {
    leads,
    loading,
    updateLead,
    deleteLead,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  } = useCRM();

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingLead, setEditingLead] = useState(null);

  if (loading) {
    return <LoadingSkeleton variant="cards" />;
  }

  const handleStatusChange = async (id, newStatus) => {
    await updateLead(id, { status: newStatus });
    setActiveMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead? This action is irreversible.')) {
      await deleteLead(id);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6 animate-fade-in fade-in">
      {/* Sort Sub-Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="text-sm font-semibold text-slate-500">
          Showing <span className="text-slate-800">{leads.length}</span> lead{leads.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-bold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 bg-white text-xs font-semibold text-slate-600 px-3 py-2 rounded-lg focus:outline-none hover:border-slate-350"
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Lead Name</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-1 text-xs border border-slate-200 bg-white px-3 py-2 rounded-lg font-semibold text-slate-650 hover:bg-slate-50 transition cursor-pointer"
          >
            {sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
          </button>
        </div>
      </div>

      {leads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg rounded-xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.8 rounded-full uppercase border shrink-0 ${
                    STATUS_COLORS[lead.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {lead.status}
                  </span>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === lead._id ? null : lead._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>

                    {/* Actions dropdown */}
                    {activeMenuId === lead._id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-150 rounded-lg shadow-xl py-1.5 z-20">
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Lead
                          </button>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Lead
                          </button>
                          <div className="border-t border-slate-100 my-1.5" />
                          <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Status</p>
                          {['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(lead._id, st)}
                              className={`w-full text-left px-4 py-1.5 text-xs font-medium transition ${
                                lead.status === st ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <h4 className="font-display font-bold text-slate-800 text-base leading-snug group-hover:text-indigo-650 transition-colors">
                  {lead.name}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lead.company}</span>
                </div>

                {lead.notes && (
                  <p className="text-xs text-slate-500 leading-relaxed mt-3 bg-slate-50 rounded-lg p-2.5 line-clamp-2 italic font-medium">
                    "{lead.notes}"
                  </p>
                )}
              </div>

              {/* Card Bottom */}
              <div className="mt-4.5 pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${lead.email}`} className="truncate hover:text-indigo-600 hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`tel:${lead.phone}`} className="hover:text-indigo-600">
                    {lead.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-2.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-350" />
                    <span>Updated: {new Date(lead.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                    {lead.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-xs flex flex-col items-center max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-450 border border-slate-150 mb-4 shadow-inner animate-pulse">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-display font-extrabold text-slate-800 text-lg">No Leads Found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs">
            We couldn't find any leads matching the current filters or search terms. Try modifying your criteria.
          </p>
        </div>
      )}

      {/* Editing Modal */}
      {editingLead && (
        <LeadModal lead={editingLead} onClose={() => setEditingLead(null)} />
      )}
    </div>
  );
};

export default CardView;
