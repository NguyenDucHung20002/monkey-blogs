import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import User from "./User.js";
import MongoDB from "../../databases/mongodb/connect.js";
import extractImg from "../../utils/extractImg.js";
import clarifai from "../../services/clarifai.js";

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
      defaultValue: "pending",
    },
  },

  {
    tableName: "articles",
    timestamps: true,
    paranoid: true,
    // hooks: {
    //   afterCreate: async (article, options) => {
    //     const imgsName = extractImg(article.content);
    //     console.log(imgsName);

    //     const gfs = MongoDB.gfs;

    //     const resultCheck = await Promise.all(
    //       imgsName.map(async (imgName) => {
    //         try {
    //           const files = await gfs.find({ filename: imgName }).toArray();

    //           if (!files || !files.length) {
    //             console.log("image not found");
    //             return null;
    //           }

    //           const readStream = gfs.openDownloadStreamByName(imgName);

    //           const chunks = [];

    //           readStream.on("data", (chunk) => {
    //             chunks.push(chunk);
    //           });

    //           return new Promise((resolve, reject) => {
    //             readStream.on("end", () => {
    //               const imgData = Buffer.concat(chunks).toString("base64");
    //               clarifai(imgData, (err, results) => {
    //                 if (err) {
    //                   console.log(err);
    //                   reject(err);
    //                 } else {
    //                   resolve(results);
    //                 }
    //               });
    //             });
    //           });
    //         } catch (error) {
    //           console.error(error);
    //           return null;
    //         }
    //       })
    //     );

    //     console.log(resultCheck);
    //   },
    // },
  }
);

export default Article;
