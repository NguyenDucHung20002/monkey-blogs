import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "./Profile.js";

const Block = sequelize.define(
  "Block",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    blockedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },

    blockerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },
  },
  {
    tableName: "blocks",
    timestamps: true,
  }
);

export default Block;
