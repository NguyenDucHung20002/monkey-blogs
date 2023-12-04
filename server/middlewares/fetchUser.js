import getError from "../utils/getError.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";
import Role from "../models/mysql/Role.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import { Op } from "sequelize";

const fetchUser = async (req, res, next) => {
  try {
    const userId = req.params && req.params.id ? req.params.id : null;
    const username =
      req.params && req.params.username ? req.params.username : null;

    if (!userId && !username) {
      return res.status(400).json({
        success: false,
        message: "Invalid params imput",
      });
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ id: userId }, { username }] },
      attributes: ["status", "bannedUntil", "id", "username"],
      include: [
        {
          model: Profile,
          as: "profileInfo",
          attributes: { exclude: ["userId"] },
        },
        { model: Role, as: "role", attributes: ["name", "slug"] },
      ],
    });

    if (!user) throw ErrorResponse(404, "User not found");

    user.profileInfo.avatar = addUrlToImg(user.profileInfo.avatar);

    req.user = user;
    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }
};

export default fetchUser;
