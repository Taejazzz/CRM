import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import api, { BACKEND_URL } from '../utils/api';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    convertedLeads: 0,
    lostLeads: 0,
    conversionRate: 0,
    monthlyGrowthPercentage: 0,
    pipelineHealth: 0,
    funnel: [],
    sourceAnalytics: [],
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // View & UI controls
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, cards, kanban, compact, feed
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Notification Helper
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/leads/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Fetch Activities
  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get('/activities');
      if (res.data.success) {
        setActivities(res.data.activities);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  }, []);

  // Fetch Leads (with filters and sorting)
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        status: statusFilter,
        source: sourceFilter,
        sort: sortBy,
        order: sortOrder,
        page: currentPage,
        limit: 100, // Fetch a large batch for smooth client interactions
      };

      const res = await api.get('/leads', { params });
      if (res.data.success) {
        setLeads(res.data.leads);
        setTotalPages(res.data.pagination.totalPages);
        setTotalLeads(res.data.pagination.totalLeads);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sourceFilter, sortBy, sortOrder, currentPage]);

  // Initial Data Fetch
  useEffect(() => {
    fetchLeads();
    fetchStats();
    fetchActivities();
  }, [fetchLeads, fetchStats, fetchActivities]);

  // Set up socket listener
  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('connect', () => {
      console.log('Connected to real-time socket server.');
    });

    socket.on('lead:created', ({ lead, activity }) => {
      try {
        setLeads((prev) => {
          // 1. If lead with this real database ID already exists, do nothing
          if (prev.some((l) => l && l._id === lead._id)) return prev;

          // 2. Reconcile matching local optimistic placeholder
          const normalize = (str) => (str ? str.toString().trim().toLowerCase() : '');
          const tempIndex = prev.findIndex(
            (l) =>
              l &&
              l._id &&
              l._id.toString().startsWith('temp-') &&
              normalize(l.name) === normalize(lead.name) &&
              normalize(l.email) === normalize(lead.email) &&
              normalize(l.company) === normalize(lead.company)
          );

          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = lead; // Swap optimistic lead with database lead
            return updated;
          }

          // 3. Lead was created by another client session, append to list
          return [lead, ...prev];
        });

        // Add activity
        if (activity) {
          setActivities((prev) => [activity, ...prev].slice(0, 50));
        }
        // Refresh Stats
        fetchStats();
        showNotification(`Lead "${lead.name}" was added.`, 'info');
      } catch (err) {
        console.error('Error handling lead:created event:', err);
      }
    });

    socket.on('lead:updated', ({ lead, activity }) => {
      try {
        setLeads((prev) => prev.map((l) => (l && l._id === lead._id ? lead : l)));
        if (activity) {
          setActivities((prev) => [activity, ...prev].slice(0, 50));
        }
        fetchStats();
        showNotification(`Lead "${lead.name}" was updated.`, 'info');
      } catch (err) {
        console.error('Error handling lead:updated event:', err);
      }
    });

    socket.on('lead:deleted', ({ leadId, activity }) => {
      try {
        setLeads((prev) => prev.filter((l) => l && l._id !== leadId));
        if (activity) {
          setActivities((prev) => [activity, ...prev].slice(0, 50));
        }
        fetchStats();
        showNotification(`Lead was removed.`, 'info');
      } catch (err) {
        console.error('Error handling lead:deleted event:', err);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchStats, showNotification]);

  // Action: Add Lead with Optimistic UI Update
  const addLead = async (leadData) => {
    const tempId = `temp-${Date.now()}`;
    const tempLead = {
      ...leadData,
      _id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const previousLeads = [...leads];
    const previousStats = { ...stats };

    // Optimistically update UI
    setLeads((prev) => [tempLead, ...prev]);
    // Quick local count increment
    setStats((prev) => ({
      ...prev,
      totalLeads: prev.totalLeads + 1,
      activeLeads: leadData.status !== 'Converted' && leadData.status !== 'Lost' ? prev.activeLeads + 1 : prev.activeLeads,
      convertedLeads: leadData.status === 'Converted' ? prev.convertedLeads + 1 : prev.convertedLeads,
      lostLeads: leadData.status === 'Lost' ? prev.lostLeads + 1 : prev.lostLeads,
    }));

    try {
      const res = await api.post('/leads', leadData);
      if (res.data.success) {
        // Swap out temp item with actual DB response
        setLeads((prev) => {
          // If the socket event has already processed and added this lead,
          // simply remove the tempId placeholder to avoid duplicates.
          if (prev.some((l) => l && l._id === res.data.lead._id)) {
            return prev.filter((l) => l && l._id !== tempId);
          }
          return prev.map((l) => (l && l._id === tempId ? res.data.lead : l));
        });
        showNotification(`Lead "${res.data.lead.name}" created successfully!`);
        fetchStats();
        fetchActivities();
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      // Revert state on error
      setLeads(previousLeads);
      setStats(previousStats);
      showNotification('Failed to create lead. Please check validations.', 'error');
      return { success: false, error: err.response?.data?.message || 'Error occurred' };
    }
  };

  // Action: Update Lead with Optimistic UI Update
  const updateLead = async (id, updatedFields) => {
    const previousLeads = [...leads];
    const previousStats = { ...stats };
    const targetLead = leads.find((l) => l._id === id);

    if (!targetLead) return { success: false };

    const tempUpdatedLead = {
      ...targetLead,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update UI
    setLeads((prev) => prev.map((l) => (l._id === id ? tempUpdatedLead : l)));

    try {
      const res = await api.put(`/leads/${id}`, updatedFields);
      if (res.data.success) {
        setLeads((prev) => prev.map((l) => (l._id === id ? res.data.lead : l)));
        showNotification(`Lead "${res.data.lead.name}" updated successfully.`);
        fetchStats();
        fetchActivities();
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      // Revert state
      setLeads(previousLeads);
      setStats(previousStats);
      showNotification('Failed to update lead.', 'error');
      return { success: false, error: err.response?.data?.message || 'Error occurred' };
    }
  };

  // Action: Delete Lead with Optimistic UI Update
  const deleteLead = async (id) => {
    const previousLeads = [...leads];
    const previousStats = { ...stats };
    const targetLead = leads.find((l) => l._id === id);

    if (!targetLead) return { success: false };

    // Optimistically update UI
    setLeads((prev) => prev.filter((l) => l._id !== id));
    // Quick count decrement
    setStats((prev) => ({
      ...prev,
      totalLeads: Math.max(0, prev.totalLeads - 1),
      activeLeads: targetLead.status !== 'Converted' && targetLead.status !== 'Lost' ? Math.max(0, prev.activeLeads - 1) : prev.activeLeads,
      convertedLeads: targetLead.status === 'Converted' ? Math.max(0, prev.convertedLeads - 1) : prev.convertedLeads,
      lostLeads: targetLead.status === 'Lost' ? Math.max(0, prev.lostLeads - 1) : prev.lostLeads,
    }));

    try {
      const res = await api.delete(`/leads/${id}`);
      if (res.data.success) {
        showNotification(`Lead removed successfully.`);
        fetchStats();
        fetchActivities();
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      // Revert state
      setLeads(previousLeads);
      setStats(previousStats);
      showNotification('Failed to delete lead.', 'error');
      return { success: false };
    }
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        stats,
        activities,
        loading,
        error,
        notification,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        sourceFilter,
        setSourceFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        totalPages,
        totalLeads,
        addLead,
        updateLead,
        deleteLead,
        fetchLeads,
        fetchStats,
        fetchActivities,
        showNotification,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
