import Activity from '../models/Activity.js';

// Get recent activities
export const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    next(error);
  }
};
