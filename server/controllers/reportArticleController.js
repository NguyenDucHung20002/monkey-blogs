import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Report_Article from "../models/mysql/Report_Article.js";
import { ARRAY, Op } from "sequelize";
import Role from "../models/mysql/Role.js";
import Article from "../models/mysql/Article.js";

// ==================== report an article ==================== //
const reportAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { reason } = req.body;

  const article = await Article.findOne({
    where: { id, status: "approved" },
    attributes: ["id", "authorid"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.authorId === me.profileInfo.id) {
    throw ErrorResponse(400, "You can not report your own article");
  }

  const reportAnArticle = await Report_Article.findOne({
    where: {
      articleId: article.id,
      userId: me.id,
      status: "pending",
    },
    attributes: ["id", "status"],
  });

  if (reportAnArticle) {
    throw ErrorResponse(
      400,
      `You have already reported this article, and the report is still pending`
    );
  }

  await Promise.all([
    Report_Article.create({
      articleId: article.id,
      userId: me.id,
      reason,
    }),
    article.increment({ reportsCount: 1 }),
  ]);

  res.status(201).json({
    success: true,
    message: `Article has been reported`,
  });
});

// ==================== get list of peding reported articles ==================== //
const getPendingReportedArticles = asyncMiddleware(async (req, res, next) => {
  const { skipId, skipCount, limit = 15, search } = req.query;

  let whereQuery = {};

  if (skipId && skipCount) {
    whereQuery[Op.or] = [
      { reportsCount: { [Op.lt]: skipCount } },
      {
        [Op.and]: [{ reportsCount: skipCount }, { id: { [Op.gt]: skipId } }],
      },
    ];
  }

  const reports = await Report_Article.findAll({
    where: { status: "pending" },
    attributes: ["articleId"],
    include: [
      {
        model: Article,
        as: "article",
        attributes: ["id", "title", "banner", "slug", "reportsCount", "status"],
        include: {
          model: User,
          as: "approvedBy",
          attributes: ["id", "username", "email"],
        },
        where: whereQuery,
      },
    ],
    order: [[{ model: Article, as: "article" }, "reportsCount", "DESC"]],
    group: ["articleId"],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const reportedProfiles = reports.map((report) => {
    return {
      id: report.article.id,
      title: report.article.title,
      banner: report.article.banner,
      reportsCount: report.article.reportsCount,
      slug: report.article.slug,
      status: report.article.status,
      approvedBy: report.article ? report.article.approvedBy : null,
    };
  });

  const newSkipId =
    reports.length > 0 ? reports[reports.length - 1].articleId : null;
  const newSkipCount =
    reports.length > 0
      ? reports[reports.length - 1].article.reportsCount
      : null;

  res.json({
    success: true,
    data: reportedProfiles,
    newSkipId,
    newSkipCount,
  });
});

// ==================== Get pending reports of article ==================== //
const getPendingReportsOfArticle = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const { id } = req.params;

  let whereQuery = { status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_Article.findAll({
    where: whereQuery,
    attributes: { exclude: ["articleId", "userId", "resolvedById"] },
    include: [
      { model: Article, as: "article", where: { id }, attributes: [] },
      { model: User, as: "user", attributes: ["id", "username", "email"] },
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

// ==================== Mark a report of the user as resolved ==================== //
const markAReportAsResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const report = await Report_Article.findByPk(id, {
    attributes: ["id"],
  });

  if (!report) throw ErrorResponse(404, "Report not found");

  await report.update({ status: "resolved", resolvedById: me.id });

  res.json({
    success: true,
    message: "Report marked as resolved successfully",
  });
});

// ==================== Mark all reports of the user as resolved ==================== //
const markAllResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findByPk(id, {
    attributes: ["id"],
  });

  await Promise.all([
    Report_Article.update(
      { status: "resolved", resolvedById: me.id },
      { where: { status: "pending", articleId: article.id } }
    ),
    article.update({ reportsCount: 0 }),
  ]);

  res.json({
    success: true,
    message: "All reports marked as resolved successfully",
  });
});

// ==================== Get resolved reports ==================== //
const getResolvedReports = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;

  let whereQuery = { status: "resolved" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_Article.findAll({
    where: whereQuery,
    attributes: { exclude: ["articleId", "userId", "resolvedById"] },
    include: [
      {
        model: Article,
        as: "article",
        attributes: ["id", "title", "banner", "slug", "reportsCount", "status"],
      },
      { model: User, as: "user", attributes: ["id", "username", "email"] },
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

export default {
  reportAnArticle,
  getPendingReportedArticles,
  getPendingReportsOfArticle,
  getResolvedReports,
  markAReportAsResolved,
  markAllResolved,
};
