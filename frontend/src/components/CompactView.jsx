import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Trash2,
  Inbox,
  ArrowUpDown
} from 'lucide-react';
import LeadModal from './LeadModal';
import LoadingSkeleton from './LoadingSkeleton';
import { STATUS_COLORS } from './CardView';

const CompactView = () => {
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

  const [editingLead, setEditingLead] = useState(null);

  if (loading) {
    return <LoadingSkeleton variant="compact" />;
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateLead(id, { status: newStatus });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending for new sort
    }
  };

  return (
    <div className="space-y-6 animate-fade-in fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {/* Table header/body container */}
        <div className="overflow-x-auto">
          {leads.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th
                    onClick={() => handleSort('name')}
                    className="p-4 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      Lead Name
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('company')}
                    className="p-4 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      Company
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4">Contact Info</th>
                  <th
                    onClick={() => handleSort('status')}
                    className="p-4 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      Status
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4">Source</th>
                  <th
                    onClick={() => handleSort('createdAt')}
                    className="p-4 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      Created
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition duration-150">
                    {/* Name */}
                    <td className="p-4 font-semibold text-slate-800">
                      {lead.name}
                    </td>

                    {/* Company */}
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{lead.company}</span>
                      </div>
                    </td>

                    {/* Contact info */}
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-2 text-xs text-slate-650">
                        <Mail className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                        <a href={`mailto:${lead.email}`} className="hover:text-indigo-600 hover:underline">
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-650">
                        <Phone className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                        <a href={`tel:${lead.phone}`} className="hover:text-indigo-600">
                          {lead.phone}
                        </a>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                          STATUS_COLORS[lead.status] || 'bg-slate-50 text-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    {/* Source */}
                    <td className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        {lead.source}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="p-1 text-slate-400 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Empty Table */
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-150 mb-3 shadow-inner">
                <Inbox className="w-7 h-7" />
              </div>
              <h4 className="font-display font-extrabold text-slate-800">No leads matched search criteria</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Try clear filters or change spelling of search terms.
              </p>
            </div>
          )}
        </div>
      </div>

      {editingLead && (
        <LeadModal lead={editingLead} onClose={() => setEditingLead(null)} />
      )}
    </div>
  );
};

export default CompactView;
