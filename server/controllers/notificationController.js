import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import Notification from "../models/mysql/Notification.js";
import User from "../models/mysql/User.js";
import Role from "../models/mysql/Role.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Article from "../models/mysql/Article.js";

// ==================== get notifications ==================== //

const getNotifications = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { receiverId: me.profileInfo.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const [notifications] = await Promise.all([
    Notification.findAll({
      where: whereQuery,
      attributes: { exclude: ["senderId", "receiverId", "articleId"] },
      include: [
        {
          model: Profile,
          as: "sender",
          attributes: ["id", "fullname", "avatar"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
        },
        {
          model: Article,
          as: "article",
          attributes: ["id", "title", "slug"],
        },
      ],
      order: [["id", "DESC"]],
      limit: Number(limit) ? Number(limit) : 15,
    }),
    me.profileInfo.update({ notificationsCount: 0 }),
  ]);

  const newSkip =
    notifications.length > 0
      ? notifications[notifications.length - 1].id
      : null;

  res.json({
    success: true,
    data: notifications,
    notificationsCount: 0,
    newSkip,
  });
});

// ==================== mark all notifications as read ==================== //

const martAllNotificationsAsRead = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await Notification.update(
    { isRead: true },
    { where: { receiverId: me.profileInfo.id, isRead: false } }
  );

  res.json({
    success: true,
    message: "Marked all notifications as read successfully",
  });
});

// ==================== clear read notifications ==================== //

const clearReadNotifications = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await Notification.destroy({
    where: { receiverId: me.profileInfo.id, isRead: true },
  });

  res.json({
    success: true,
    message: "Cleared read notifications successfully",
  });
});

export default {
  getNotifications,
  martAllNotificationsAsRead,
  clearReadNotifications,
};
