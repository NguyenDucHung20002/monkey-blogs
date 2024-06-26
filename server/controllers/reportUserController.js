import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Report_User from "../models/mysql/Report_User.js";
import { Op } from "sequelize";
import Role from "../models/mysql/Role.js";

// ==================== report a user ==================== //

const reportAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;
  const { reason, description } = req.body;

  if (user.id === me.id) {
    throw ErrorResponse(400, "You can not report yourself");
  }

  if (user.role.id === 3) {
    throw ErrorResponse(400, "You can not report admin");
  }

  const reportUser = await Report_User.findOne({
    where: {
      reportedId: user.id,
      reporterId: me.id,
      status: "pending",
    },
  });

  if (reportUser) {
    throw ErrorResponse(400, `You have already reported this user`);
  }

  await Promise.all([
    Report_User.create({
      reportedId: user.id,
      reporterId: me.id,
      reason,
      description,
    }),
    user.increment({ reportsCount: 1 }),
  ]);

  res.status(201).json({
    success: true,
    message: `${user.profileInfo.fullname} has been reported`,
  });
});

// ==================== get pending reported users ==================== //

const getPendingReportedUsers = asyncMiddleware(async (req, res, next) => {
  const { skipId, skipCount, limit = 15, search } = req.query;

  let whereQuery = { roleId: 1 };

  if (search) {
    whereQuery[Op.or] = [
      { email: { [Op.substring]: search } },
      { username: { [Op.substring]: search } },
    ];
  }

  if (skipId && skipCount) {
    whereQuery[Op.or] = [
      { reportsCount: { [Op.lt]: skipCount } },
      { [Op.and]: [{ reportsCount: skipCount }, { id: { [Op.lt]: skipId } }] },
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
          include: {
            model: Role,
            as: "role",
            attributes: ["id", "name", "slug"],
          },
        },
        where: whereQuery,
      },
    ],
    order: [
      [{ model: User, as: "reported" }, "reportsCount", "DESC"],
      [{ model: User, as: "reported" }, "id", "DESC"],
    ],
    group: ["reportedId"],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const result = reports.map((report) => {
    return report.reported;
  });

  const newSkipId =
    reports.length > 0 ? reports[reports.length - 1].reportedId : null;

  const newSkipCount =
    reports.length > 0
      ? reports[reports.length - 1].reported.reportsCount
      : null;

  res.json({
    success: true,
    data: result,
    newSkipId,
    newSkipCount,
  });
});

// ==================== get pending reported staffs ==================== //

const getPendingReportedStaffs = asyncMiddleware(async (req, res, next) => {
  const { skipId, skipCount, limit = 15, search } = req.query;

  let whereQuery = { roleId: 2 };

  if (search) {
    whereQuery[Op.or] = [
      { email: { [Op.substring]: search } },
      { username: { [Op.substring]: search } },
    ];
  }

  if (skipId && skipCount) {
    whereQuery[Op.or] = [
      { reportsCount: { [Op.lt]: skipCount } },
      { [Op.and]: [{ reportsCount: skipCount }, { id: { [Op.lt]: skipId } }] },
    ];
  }

  let reports = await Report_User.findAll({
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
          include: {
            model: Role,
            as: "role",
            attributes: ["id", "name", "slug"],
          },
        },
        where: whereQuery,
      },
    ],
    order: [
      [{ model: User, as: "reported" }, "reportsCount", "DESC"],
      [{ model: User, as: "reported" }, "id", "DESC"],
    ],
    group: ["reportedId"],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const result = reports.map((report) => {
    console.log(report.toJSON());
    return report.reported;
  });

  const newSkipId =
    reports.length > 0 ? reports[reports.length - 1].reportedId : null;

  const newSkipCount =
    reports.length > 0
      ? reports[reports.length - 1].reported.reportsCount
      : null;

  res.json({
    success: true,
    data: result,
    newSkipId,
    newSkipCount,
  });
});

// ==================== get pending reports of a user ==================== //

const getPendingReportsOfAUser = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const { id } = req.params;

  let whereQuery = { status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_User.findAll({
    where: whereQuery,
    attributes: { exclude: ["reportedId", "reporterId", "resolvedById"] },
    include: [
      { model: User, as: "reported", where: { id }, attributes: [] },
      {
        model: User,
        as: "reporter",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
      {
        model: User,
        as: "resolvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = reports.length > 0 ? reports[reports.length - 1].id : null;

  res.json({
    success: true,
    data: reports,
    newSkip,
  });
});

// ==================== get resolved user reports ==================== //

const getResolvedUserReports = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;

  let whereQuery = { status: "resolved" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_User.findAll({
    where: whereQuery,
    attributes: { exclude: ["reportedId", "reporterId", "resolvedById"] },
    include: [
      {
        model: User,
        as: "reported",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
      {
        model: User,
        as: "reporter",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
      {
        model: User,
        as: "resolvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = reports.length > 0 ? reports[reports.length - 1].id : null;

  res.json({
    success: true,
    data: reports,
    newSkip,
  });
});

// ==================== mark all reports of the user as resolved ==================== //

const markAllReportsOfAUserAsResolved = asyncMiddleware(
  async (req, res, next) => {
    const me = req.me;
    const user = req.user;

    await Promise.all([
      Report_User.update(
        { status: "resolved", resolvedById: me.id },
        { where: { status: "pending", reportedId: user.id } }
      ),
      user.update({ reportsCount: 0 }),
    ]);

    res.json({
      success: true,
      message: "All reports marked as resolved successfully",
    });
  }
);

// ==================== mark a report of the user as resolved ==================== //

const markAReportOfAUserAsResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const report = await Report_User.findByPk(id);

  if (!report) throw ErrorResponse(404, "Report not found");

  await Promise.all([
    report.update({ status: "resolved", resolvedById: me.id }),
    User.increment({ reportsCount: -1 }, { where: { id: report.reportedId } }),
  ]);

  res.json({
    success: true,
    message: "Report marked as resolved successfully",
  });
});

export default {
  reportAUser,
  getPendingReportedUsers,
  getPendingReportsOfAUser,
  markAllReportsOfAUserAsResolved,
  markAReportOfAUserAsResolved,
  getResolvedUserReports,
  getPendingReportedStaffs,
};
