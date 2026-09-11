import Activity from '../models/Activity.js';

/**
 * @desc    Get all recent activities for authenticated user
 * @route   GET /api/activities
 * @access  Private
 */
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    return res.status(200).json(activities);
  } catch (error) {
    console.error(`Get activities error: ${error.message}`);
    return res.status(500).json({ message: 'Error fetching activities' });
  }
};
