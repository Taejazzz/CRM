import Lead from '../models/Lead.js';
import Activity from '../models/Activity.js';

// Get all leads with search, filter, sort, and pagination
export const getLeads = async (req, res, next) => {
  try {
    const { search, status, source, sort = 'createdAt', order = 'desc', page = 1, limit = 100 } = req.query;

    const query = {};

    // Search query: matches Name, Email, or Company
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by source
    if (source && source !== 'All') {
      query.source = source;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortQuery = { [sort]: sortOrder };

    const leads = await Lead.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    const totalLeads = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalLeads / limitNum);

    res.status(200).json({
      success: true,
      leads,
      pagination: {
        totalLeads,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single lead by ID
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// Create a new lead
export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status,
      source,
      notes,
    });

    // Create Activity Log
    const activity = await Activity.create({
      action: 'Created',
      leadName: lead.name,
      details: `Added new lead at ${company} via ${source || 'Website'}.`,
    });

    // Emit live events to Socket.IO clients
    const io = req.app.get('io');
    if (io) {
      io.emit('lead:created', { lead, activity });
    }

    res.status(201).json({ success: true, lead, activity });
  } catch (error) {
    next(error);
  }
};

// Update an existing lead
export const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const previousStatus = lead.status;
    const isStatusChanged = status && status !== previousStatus;

    // Apply updates
    lead.name = name || lead.name;
    lead.email = email || lead.email;
    lead.phone = phone || lead.phone;
    lead.company = company || lead.company;
    lead.status = status || lead.status;
    lead.source = source || lead.source;
    lead.notes = notes !== undefined ? notes : lead.notes;

    const updatedLead = await lead.save();

    // Create Activity Log
    let activityAction = 'Updated';
    let activityDetails = `Updated lead details for ${updatedLead.name}.`;

    if (isStatusChanged) {
      activityAction = 'Status Change';
      activityDetails = `Changed status of ${updatedLead.name} from "${previousStatus}" to "${updatedLead.status}".`;
    }

    const activity = await Activity.create({
      action: activityAction,
      leadName: updatedLead.name,
      details: activityDetails,
    });

    // Emit live events to Socket.IO clients
    const io = req.app.get('io');
    if (io) {
      io.emit('lead:updated', { lead: updatedLead, activity });
    }

    res.status(200).json({ success: true, lead: updatedLead, activity });
  } catch (error) {
    next(error);
  }
};

// Delete a lead
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const leadName = lead.name;
    await Lead.findByIdAndDelete(req.params.id);

    // Create Activity Log
    const activity = await Activity.create({
      action: 'Deleted',
      leadName,
      details: `Removed lead "${leadName}" from ${lead.company}.`,
    });

    // Emit live events to Socket.IO clients
    const io = req.app.get('io');
    if (io) {
      io.emit('lead:deleted', { leadId: req.params.id, activity });
    }

    res.status(200).json({ success: true, message: 'Lead deleted successfully', activity });
  } catch (error) {
    next(error);
  }
};

// Get Dashboard Statistics
export const getLeadStats = async (req, res, next) => {
  try {
    // 1. Basic status stats
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    const activeLeads = newLeads + contactedLeads + qualifiedLeads;

    // 2. Conversion rate (Converted / Total)
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    // 3. Lead source analytics
    const sourceAnalytics = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          source: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // 4. Monthly Growth (compare current month vs previous month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthCount = await Lead.countDocuments({
      createdAt: { $gte: currentMonthStart },
    });

    const previousMonthCount = await Lead.countDocuments({
      createdAt: {
        $gte: previousMonthStart,
        $lt: currentMonthStart, // Captures 100% of the previous month time window
      },
    });

    let monthlyGrowthPercentage = 0;
    if (previousMonthCount > 0) {
      monthlyGrowthPercentage = Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100);
    } else if (currentMonthCount > 0) {
      monthlyGrowthPercentage = 100; // 100% growth if there were none in previous month
    }

    // 5. Funnel Analytics (representing standard progression steps)
    const funnel = [
      { name: 'New', count: newLeads },
      { name: 'Contacted', count: contactedLeads },
      { name: 'Qualified', count: qualifiedLeads },
      { name: 'Converted', count: convertedLeads },
    ];

    // 6. Pipeline Health Check: percentage of qualified + converted vs total
    const highQualityLeads = qualifiedLeads + convertedLeads;
    const pipelineHealth = totalLeads > 0 ? Math.round((highQualityLeads / totalLeads) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        activeLeads,
        convertedLeads,
        lostLeads,
        conversionRate,
        monthlyGrowthPercentage,
        pipelineHealth,
        funnel,
        sourceAnalytics,
      },
    });
  } catch (error) {
    next(error);
  }
};
