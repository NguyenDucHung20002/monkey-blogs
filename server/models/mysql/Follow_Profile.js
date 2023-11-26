import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";

const Follow_Profile = sequelize.define(
  "Follow_Profile",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },

    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },
  },
  {
    tableName: "follow_profiles",
    timestamps: true,
  }
);

export default Follow_Profile;
