const Role = require("../models/Role");
const createRoles = async () => {
  try {
    let [admin, staff, user] = await Promise.all([
      Role.findOne({ slug: "admin" }),
      Role.findOne({ slug: "staff" }),
      Role.findOne({ slug: "user" }),
    ]);

    if (!admin) admin = { name: "Admin", slug: "admin" };

    if (!staff) staff = { name: "Staff", slug: "staff" };

    if (!user) user = { name: "User", slug: "user" };

    await Role.create([admin, staff, user]);
  } catch (error) {
    console.error("Error creating roles:", error);
  }
};
module.exports = createRoles;
