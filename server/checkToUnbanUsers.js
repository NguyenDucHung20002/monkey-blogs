import User from "./models/mysql/User.js";
import { Op } from "sequelize";

const checkToUnBanUsers = async () => {
  try {
    const currentDate = new Date();

    const usersToUnband = await User.findAll({
      where: { bannedUntil: { [Op.lt]: currentDate } },
    });

    for (const user of usersToUnband) {
      await user.update({
        status: "normal",
        banType: null,
        bannedById: null,
        bannedUntil: null,
      });
    }
    console.log("check to unban users successfully");
  } catch (error) {
    console.log("Error when check to unban users =>", error);
  }
};

export default checkToUnBanUsers;
