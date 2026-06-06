import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  Building2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  Inbox,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import LeadModal from './LeadModal';
import LoadingSkeleton from './LoadingSkeleton';

const PIPELINE_COLUMNS = [
  { id: 'New', label: 'New Lead', color: 'border-t-indigo-600 bg-white/50' },
  { id: 'Contacted', label: 'Contacted', color: 'border-t-sky-500 bg-white/50' },
  { id: 'Qualified', label: 'Qualified', color: 'border-t-amber-500 bg-white/50' },
  { id: 'Converted', label: 'Converted', color: 'border-t-emerald-500 bg-white/50' },
  { id: 'Lost', label: 'Lost', color: 'border-t-rose-500 bg-white/50' },
];

const KanbanView = () => {
  const { leads, loading, updateLead, deleteLead } = useCRM();
  const [editingLead, setEditingLead] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  if (loading) {
    return <LoadingSkeleton variant="kanban" />;
  }

  // Handle HTML5 Drag and Drop events
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      const targetLead = leads.find((l) => l._id === leadId);
      if (targetLead && targetLead.status !== targetStatus) {
        await updateLead(leadId, { status: targetStatus });
      }
    }
  };

  // Quick state push helpers (for mobile/tablet where dragging is harder)
  const moveLeadStatus = async (leadId, currentStatus, direction) => {
    const currentIndex = PIPELINE_COLUMNS.findIndex((col) => col.id === currentStatus);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < PIPELINE_COLUMNS.length) {
      const targetStatus = PIPELINE_COLUMNS[newIndex].id;
      await updateLead(leadId, { status: targetStatus });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] space-y-4 animate-fade-in fade-in">
      {/* Helper Tip */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl px-4 py-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-indigo-850">
          💡 Pro-Tip: Drag and drop cards between columns to update lead statuses instantly.
        </p>
        <span className="text-[10px] text-indigo-400 font-bold hidden sm:inline">Socket-Synced</span>
      </div>

      {/* Board Columns Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto pb-4">
        {PIPELINE_COLUMNS.map((column) => {
          const columnLeads = leads.filter((l) => l.status === column.id);
          const isOver = draggedOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`border border-slate-200 border-t-4 rounded-xl flex flex-col h-full transition-all duration-200 ${
                column.color
              } ${isOver ? 'ring-2 ring-indigo-500/30 bg-indigo-50/10 scale-[1.01]' : ''}`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0">
                <span className="font-display font-bold text-slate-800 text-sm">
                  {column.label}
                </span>
                <span className="bg-slate-205/80 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold border border-slate-200">
                  {columnLeads.length}
                </span>
              </div>

              {/* Lead Cards List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-[150px]">
                {columnLeads.length > 0 ? (
                  columnLeads.map((lead) => (
                    <div
                      key={lead._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead._id)}
                      className="bg-white border border-slate-200 hover:border-indigo-450 hover:shadow-md rounded-xl p-3.5 shadow-2xs cursor-grab active:cursor-grabbing transition-all duration-200 group relative"
                    >
                      {/* Edit/Delete mini hover actions */}
                      <div className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/95 rounded-lg p-0.5 shadow-xs border border-slate-100 z-10">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <h5 className="font-display font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-650 transition-colors pr-8">
                        {lead.name}
                      </h5>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mt-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{lead.company}</span>
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-2 bg-slate-50 rounded px-1.5 py-1 border border-slate-100">
                          {lead.notes}
                        </p>
                      )}

                      {/* Card actions bottom */}
                      <div className="flex items-center justify-between border-t border-slate-100 mt-3.5 pt-2.5 text-[10px] text-slate-450">
                        <div className="flex gap-1.5 items-center">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px]">
                            {lead.source}
                          </span>
                        </div>

                        {/* Arrows for column shifting (mobile friendly) */}
                        <div className="flex items-center gap-1">
                          <button
                            disabled={column.id === 'New'}
                            onClick={() => moveLeadStatus(lead._id, lead.status, -1)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={column.id === 'Lost'}
                            onClick={() => moveLeadStatus(lead._id, lead.status, 1)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-xl py-8">
                    <span className="text-xs text-slate-400 font-semibold">Drop leads here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal toggle */}
      {editingLead && (
        <LeadModal lead={editingLead} onClose={() => setEditingLead(null)} />
      )}
    </div>
  );
};

export default KanbanView;
