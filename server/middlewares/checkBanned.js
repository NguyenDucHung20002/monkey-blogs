import getError from "../utils/getError.js";

const checkBanned = async (req, res, next) => {
  try {
    const user = req.user ? req.user : null;

    if (!user) {
      next();
      return;
    }

    if (user.status === "banned") {
      if (user.bannedUntil === null) {
        return res.status(403).json({
          success: false,
          message: `You have been permanent banned`,
        });
      }

      return res.status(403).json({
        success: false,
        message: `You have been banned until ${user.bannedUntil}`,
      });
    }

    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }
};

export default checkBanned;
