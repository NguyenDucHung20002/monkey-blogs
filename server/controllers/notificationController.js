import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import Notification from "../models/mysql/Notification.js";
import User from "../models/mysql/User.js";
import Role from "../models/mysql/Role.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Article from "../models/mysql/Article.js";

const getNotifications = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { reciverId: me.profileInfo.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const [notifications] = await Promise.all([
    Notification.findAll({
      where: whereQuery,
      attributes: { exclude: ["senderId", "reciverId", "articleId"] },
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
    me.profileInfo.update({ unReadNotificationsCount: 0 }),
  ]);

  const newSkip =
    notifications.length > 0
      ? notifications[notifications.length - 1].id
      : null;

  res.json({
    success: true,
    data: notifications,
    unReadNotificationsCount: 0,
    newSkip,
  });
});

const markAsReaded = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const notification = await Notification.findOne({
    where: { id, isReaded: false },
  });

  if (!notification) throw ErrorResponse(404, "Notification not found");

  await Promise.all([
    notification.update({ isReaded: true }),
    me.profileInfo.increment({ unReadNotificationsCount: -1 }),
  ]);

  res.json({
    success: true,
    message: "Marked notification as readed successfully",
  });
});

const martAllAsReaded = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  const markAsReadedNotifications = await Notification.update(
    { isReaded: true },
    { where: { reciverId: me.profileInfo.id, isReaded: false } }
  );

  await me.profileInfo.increment({
    unReadNotificationsCount: -markAsReadedNotifications,
  });

  res.json({
    success: true,
    message: "Marked all notifications as readed successfully",
  });
});

export default { getNotifications, markAsReaded, martAllAsReaded };
