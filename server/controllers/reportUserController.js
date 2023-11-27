import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Report_User from "../models/mysql/Report_User.js";
import { Op } from "sequelize";
import Role from "../models/mysql/Role.js";

// ==================== report a user ==================== //
const reportAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { reason, description } = req.body;

  const profile = await Profile.findByPk(id, {
    attributes: ["fullname"],
    include: {
      model: User,
      as: "userInfo",
      where: { status: "normal" },
      attributes: ["id"],
    },
  });

  if (!profile) throw ErrorResponse(404, "User not found");

  if (profile.id === me.profileInfo.id) {
    throw ErrorResponse(400, "You can not report yourself");
  }

  const reportUser = await Report_User.findOne({
    where: {
      reportedId: profile.userInfo.id,
      reporterId: me.id,
      status: "pending",
    },
    attributes: ["id", "status"],
  });

  if (reportUser) {
    throw ErrorResponse(
      400,
      `You have already reported this user, and the report is still pending`
    );
  }

  await Promise.all([
    Report_User.create({
      reportedId: profile.userInfo.id,
      reporterId: me.id,
      reason,
      description,
    }),
    profile.userInfo.increment({ reportsCount: 1 }),
  ]);

  res.status(201).json({
    success: true,
    message: `${profile.fullname} has been reported`,
  });
});

// ==================== get list of peding reported users ==================== //
const getPendingReportedUsers = asyncMiddleware(async (req, res, next) => {
  const { skipId, skipReportsCount, limit = 15, search } = req.query;

  let whereQuery = {};

  if (search) {
    whereQuery[Op.or] = [
      { email: { [Op.substring]: search } },
      { username: { [Op.substring]: search } },
    ];
  }

  if (skipId && skipReportsCount) {
    whereQuery[Op.or] = [
      { reportsCount: { [Op.lt]: skipReportsCount } },
      {
        [Op.and]: [
          { reportsCount: skipReportsCount },
          { id: { [Op.gt]: skipId } },
        ],
      },
    ];
  }

  const reports = await Report_User.findAll({
    where: { status: "pending" },
    attributes: ["reportedId"],
    include: [
      {
        model: User,
        as: "reported",
        attributes: {
          exclude: ["roleId", "createdAt", "updatedAt", "bannedById"],
        },
        include: {
          model: User,
          as: "bannedBy",
          attributes: ["id", "username", "email"],
        },
        where: whereQuery,
      },
    ],
    order: [[{ model: User, as: "reported" }, "reportsCount", "DESC"]],
    group: ["reportedId"],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkipId =
    reports.length > 0 ? reports[reports.length - 1].reportedId : null;
  const newSkipReportsCount =
    reports.length > 0
      ? reports[reports.length - 1].reported.reportsCount
      : null;

  res.json({ success: true, data: reports, newSkipId, newSkipReportsCount });
});

// ==================== Get pending reports of the user ==================== //
const getPendingReportsOfUser = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const { id } = req.params;

  let whereQuery = { status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_User.findAll({
    where: whereQuery,
    attributes: { exclude: ["reportedId", "reporterId", "resolvedById"] },
    include: [
      { model: User, as: "reported", where: { id }, attributes: [] },
      { model: User, as: "reporter", attributes: ["id", "username", "email"] },
      {
        model: User,
        as: "resolvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = reports.length > 0 ? reports[reports.length - 1].id : null;

  res.json({ success: true, data: reports, newSkip });
});

// ==================== Get resolved reports ==================== //
const getResolvedReports = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;

  let whereQuery = { status: "resolved" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_User.findAll({
    where: whereQuery,
    attributes: { exclude: ["reportedId", "reporterId", "resolvedById"] },
    include: [
      { model: User, as: "reported", attributes: ["id", "username", "email"] },
      { model: User, as: "reporter", attributes: ["id", "username", "email"] },
      {
        model: User,
        as: "resolvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = reports.length > 0 ? reports[reports.length - 1].id : null;

  res.json({ success: true, data: reports, newSkip });
});

// ==================== Mark all reports of the user as resolved ==================== //
const markAllResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const reported = await User.findByPk(id, {
    attributes: ["id"],
  });

  if (!reported) throw ErrorResponse(404, "User not found");

  await Promise.all([
    Report_User.update(
      { status: "resolved", resolvedById: me.id },
      { where: { status: "pending", reportedId: reported.id } }
    ),
    reported.update({ reportsCount: 0 }),
  ]);

  res.json({ success: true });
});

// ==================== Mark a report of the user as resolved ==================== //
const markAReportAsResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const report = await Report_User.findByPk(id, {
    attributes: ["id"],
  });

  if (!report) throw ErrorResponse(404, "Report not found");

  await report.update({ status: "resolved", resolvedById: me.id });

  res.json({
    success: true,
    message: "Report marked as resolved successfully",
  });
});

export default {
  reportAUser,
  getPendingReportedUsers,
  getPendingReportsOfUser,
  markAllResolved,
  markAReportAsResolved,
  getResolvedReports,
};
