const Notification = require("../models/Notification");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get all notifications ==================== //

const getAllNotifications = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ recipient: me._id })
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ created: -1 });

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

// ==================== delete Notification ==================== //

const deleteNotification = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { id } = req.params;

  await Notification.findOneAndDelete({ _id: id, recipient: me._id });

  res.status(200).json({
    success: true,
  });
});

// ==================== delete All Notifications ==================== //

const deleteAllNotifications = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  await Notification.deleteMany({ recipient: me._id });

  res.status(200).json({
    success: true,
  });
});

// ==================== mart notification as read ==================== //

const MarkAsRead = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  await Notification.findOneAndUpdate(
    { recipient: me._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
  });
});

// ==================== mart all notifications as read ==================== //

const markAllNotificationsAsRead = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  await Notification.updateMany(
    { recipient: me._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  getAllNotifications,
  deleteAllNotifications,
  deleteNotification,
  markAllNotificationsAsRead,
  MarkAsRead,
};
