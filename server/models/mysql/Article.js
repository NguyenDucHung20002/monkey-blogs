import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import User from "./User.js";
import extractImg from "../../utils/extractImg.js";
import MongoDB from "../../databases/mongodb/connect.js";

const Article = sequelize.define(
  "Article",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },

    banner: { type: DataTypes.STRING, allowNull: true },

    title: { type: DataTypes.STRING, allowNull: false },

    preview: { type: DataTypes.STRING, allowNull: false },

    slug: { type: DataTypes.STRING, allowNull: false, unique: true },

    content: { type: DataTypes.TEXT, allowNull: false },

    likesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    commentsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    reportsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    approvedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM("pending", "approved"),
      allowNull: false,
      defaultValue: "approved",
    },
  },

  {
    tableName: "articles",
    timestamps: true,
    paranoid: true,
    hooks: {
      afterCreate: (article, options) => {
        const imgsName = extractImg(article.content);

        const gfs = MongoDB.gfs;

        const resultCheck = imgsName.map((imgName) => {
          const files = gfs.find({ filename }).toArray();

          if (!files || !files.length) console.log("image not found");

          const readStream = gfs.openDownloadStreamByName(imgName);

          let chunks = [];

          readStream.on("data", (chunk) => {
            chunks.push(chunk);
          });

          readStream.on("end", () => {
            const imgData = Buffer.concat(chunks).toString("base64");
            clarifai(imgData, (err, results) => {
              if (err) console.log(err);
              return results;
            });
          });
        });
        console.log(resultCheck);
      },
    },
  }
);

export default Article;
