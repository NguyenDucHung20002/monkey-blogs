const Block = require("../models/Block");

const blockCheck = async (req, res, next) => {
  try {
    const { me, user } = req;

    if (me) {
      const block = await Block.findOne({ user: user._id, block: me._id });
      if (block) {
        return res.status(400).json({
          success: false,
          message: "this user has blocked you",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = blockCheck;
