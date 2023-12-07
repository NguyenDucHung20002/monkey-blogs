import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import Notification from "../models/mysql/notification.js";
import User from "../models/mysql/User.js";
import Role from "../models/mysql/Role.js";
import { Op } from "sequelize";

const getNotifications = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 10 } = req.query;

  let whereQuery = { reciverId: me.profileInfo.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let notifications = await Notification.findAll({
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
        model: Profile,
        as: "reciver",
        attributes: ["id", "fullname", "avatar"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 16,
  });

  notifications = notifications.map((notification) => {
    return {
      id: notification.id,
      sender: {
        id: notification.sender.id,
        fullname: notification.sender.fullname,
        username: notification.sender.userInfo.username,
        role: notification.sender.userInfo.role.slug,
      },
      reciver: {
        id: notification.reciver.id,
        fullname: notification.reciver.fullname,
        username: notification.reciver.userInfo.username,
        role: notification.reciver.userInfo.role.slug,
      },
      content: notification.content,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  });

  const newSkip =
    notifications.length > 0
      ? notifications[notifications.length - 1].id
      : null;

  res.json({ success: true, data: notifications, newSkip });
});

export default { getNotifications };
