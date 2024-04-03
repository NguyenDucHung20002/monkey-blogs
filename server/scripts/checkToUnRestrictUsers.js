import User from "../models/mysql/User.js";
import { Op } from "sequelize";

const checkToUnRestrictUsers = async () => {
  try {
    const currentDate = new Date();

    const usersToUnRestrict = await User.findAll({
      where: { bannedUntil: { [Op.lt]: currentDate } },
    });

    for (const user of usersToUnRestrict) {
      await user.update({
        status: "normal",
        banType: null,
        bannedById: null,
        bannedUntil: null,
      });
    }
    console.log("check to un restrict users successfully");
  } catch (error) {
    console.log("error when check to un restrict users =>", error);
  }
};

export default checkToUnRestrictUsers;
