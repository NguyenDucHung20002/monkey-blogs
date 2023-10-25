const Notification = require("../models/Notification");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get all notifications ==================== //

const getNotifications = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { skip, limit = 15 } = req.query;

  const query = { recipient: me._id };

  if (skip) query._id = { $lt: skip };

  const notifications = await Notification.find(query)
    .lean()
    .select("-recipient -isRead")
    .limit(limit)
    .sort({ createdAt: -1 });

  notifications.forEach(async (val) => {
    await Notification.updateOne({ _id: val._id }, { isRead: true });
  });

  const skipID =
    notifications.length > 0
      ? notifications[notifications.length - 1]._id
      : null;

  res.status(200).json({ success: true, data: notifications, skipID });
});

// ==================== Count Unread Notifications ==================== //

const countUnRead = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  const count = await Notification.count({ recipient: me._id, isRead: false });

  res.status(200).json({ success: true, data: count });
});

module.exports = {
  getNotifications,
  countUnRead,
};
