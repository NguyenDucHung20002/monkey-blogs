import Token from "../models/mongodb/Token.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";

const login = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  res.json({
    success: true,
    data: {
      ...me.profileInfo.toJSON(),
      username: me.username,
      role: me.role.slug,
    },
  });
});

const logout = asyncMiddleware(async (req, res, next) => {
  const { id: myUserId, iat, exp } = req.jwtPayLoad;

  const myProfile = await User.findByPk(myUserId, { attributes: ["id"] });

  if (!myProfile) throw ErrorResponse(404, "Profile not found");

  await Token.deleteOne({ userId: myProfile.id, iat, exp });

  res.json({ success: true, message: "Successfully logout" });
});

export default { login, logout };
