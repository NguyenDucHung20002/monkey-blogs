const Role = require("../models/Role");
const createRoles = async () => {
  try {
    let admin = await Role.findOne({ slug: "admin" });
    let staff = await Role.findOne({ slug: "staff" });
    let user = await Role.findOne({ slug: "user" });

    if (!admin) {
      admin = { name: "Admin", slug: "admin" };
    }

    if (!staff) {
      staff = { name: "Staff", slug: "staff" };
    }

    if (!user) {
      user = { name: "User", slug: "user" };
    }

    const createdRoles = await Role.create([admin, staff, user]);
    console.log("Roles created:", createdRoles);
  } catch (error) {
    console.error("Error creating roles:", error);
  }
};
module.exports = createRoles;
