import Token from "../models/mongodb/Token.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";

const login = asyncMiddleware(async (req, res, next) => {
  const user = req.user;

  res.json({
    success: true,
    data: {
      ...user.profileInfo.toJSON(),
      username: user.username,
      role: user.role.slug,
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
