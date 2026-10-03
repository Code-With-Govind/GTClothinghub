const Settings = require('../models/Settings');
const AdminAuditLog = require('../models/AdminAuditLog');

// @desc    Get website settings (Public)
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    // Public sanitized version (omits administrative flags if necessary)
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website settings (Admin)
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await AdminAuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'SETTINGS_UPDATED',
      entity: 'Settings',
      entityId: settings._id.toString(),
      metadata: { businessMode: settings.businessMode, gstin: settings.gstin },
    });

    res.json({ success: true, settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
