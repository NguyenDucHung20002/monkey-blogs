import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";
import generateUserName from "../utils/generateUserName.js";
import env from "../config/env.js";
import hashPassword from "../utils/hashPassword.js";

const createAdminAccount = async () => {
  try {
    const email = env.NODEMAILER_GOOGLE_EMAIL;
    let user = await User.findOne({ where: { email } });

    if (!user) {
      const user = await User.create({
        username: generateUserName(email),
        email,
        password: hashPassword(env.ADMIN_PASSWORD),
        roleId: 3,
        isVerified: true,
      });

      await Profile.create({ userId: user.id });
    }

    console.log("initialized admin account successfully");
  } catch (error) {
    console.log("error when initializing admin account =>", error);
  }
};

export default createAdminAccount;
