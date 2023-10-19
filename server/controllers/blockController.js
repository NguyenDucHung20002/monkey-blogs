const Block = require("../models/Block");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== block or unblock a user ==================== //

const BlockOrUnBlockAUser = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;

  if (me && me._id.toString() === user._id.toString()) {
    throw new ErrorResponse(400, ":)");
  }

  let block = await Block.findOne({ user: me._id, block: user._id }).lean();
  if (!block) {
    block = new Block({ user: me._id, block: user._id });

    await block.save();
  } else {
    await block.deleteOne({ _id: block._id });
  }

  res.status(200).json({
    success: true,
  });
});

module.exports = { BlockOrUnBlockAUser };
