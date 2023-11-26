import getError from "../utils/getError.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";
import Role from "../models/mysql/Role.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";

const fetchMe = async (req, res, next) => {
  try {
    const myUserId =
      req.jwtPayLoad && req.jwtPayLoad.id ? req.jwtPayLoad.id : null;

    if (!myUserId) {
      next();
      return;
    }

    const me = await User.findByPk(myUserId, {
      attributes: ["status", "bannedUntil", "id", "username"],
      include: [
        {
          model: Profile,
          as: "profileInfo",
          attributes: ["id", "fullname", "avatar"],
        },
        { model: Role, as: "role", attributes: ["slug"] },
      ],
    });

    if (!me) throw ErrorResponse(404, "User not found");

    me.profileInfo.avatar = addUrlToImg(me.profileInfo.avatar);

    req.me = me;
    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.code).json({
      success: true,
      message: err.message,
    });
  }
};

export default fetchMe;
