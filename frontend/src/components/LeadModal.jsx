import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { X, Save, AlertCircle } from 'lucide-react';

const LeadModal = ({ lead, onClose }) => {
  const { addLead, updateLead } = useCRM();
  const isEdit = !!lead;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: 'Website',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
        source: lead.source || 'Website',
        notes: lead.notes || '',
      });
    }
  }, [lead]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please fill a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.company.trim()) newErrors.company = 'Company name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let result;

    if (isEdit) {
      result = await updateLead(lead._id, formData);
    } else {
      result = await addLead(formData);
    }

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else if (result.error) {
      setErrors({ server: result.error });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
          <h2 className="font-display font-bold text-slate-800 text-base">
            {isEdit ? `Edit Lead: ${lead.name}` : 'Create New Lead'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errors.server && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3.5 flex gap-3 items-start text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errors.server}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs font-bold text-slate-650">Lead Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all ${
                  errors.name ? 'border-rose-350 bg-rose-50/20' : 'border-slate-250 bg-white'
                }`}
              />
              {errors.name && <span className="text-xs text-rose-600 font-semibold">{errors.name}</span>}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1">
              <label htmlFor="company" className="text-xs font-bold text-slate-650">Company *</label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all ${
                  errors.company ? 'border-rose-350 bg-rose-50/20' : 'border-slate-250 bg-white'
                }`}
              />
              {errors.company && <span className="text-xs text-rose-600 font-semibold">{errors.company}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-650">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@company.com"
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all ${
                  errors.email ? 'border-rose-350 bg-rose-50/20' : 'border-slate-250 bg-white'
                }`}
              />
              {errors.email && <span className="text-xs text-rose-600 font-semibold">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-xs font-bold text-slate-650">Phone Number *</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 555-0199"
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all ${
                  errors.phone ? 'border-rose-350 bg-rose-50/20' : 'border-slate-250 bg-white'
                }`}
              />
              {errors.phone && <span className="text-xs text-rose-600 font-semibold">{errors.phone}</span>}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label htmlFor="status" className="text-xs font-bold text-slate-650">Pipeline Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-slate-250 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Source */}
            <div className="flex flex-col gap-1">
              <label htmlFor="source" className="text-xs font-bold text-slate-650">Lead Source</label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="border border-slate-250 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550"
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Partner">Partner</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label htmlFor="notes" className="text-xs font-bold text-slate-650">Notes & History</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter recent conversations, meeting history, or background details..."
              className="border border-slate-250 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 resize-y"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold text-sm rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-md shadow-indigo-600/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
