import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import extractImg from "../../utils/extractImg.js";
import MongoDB from "../../databases/mongodb/connect.js";
import clarifai from "../../services/clarifai.js";
import socket from "../../socket.js";
import SocketUser from "../mongodb/SocketUser.js";

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

    preview: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },

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

    rejectedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("draft", "pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "draft",
    },
  },

  {
    tableName: "articles",
    timestamps: true,
    paranoid: true,
    //   hooks: {
    //     afterUpdate: async (article, options) => {
    //       const io = socket.getIO();

    //       const recivers = await SocketUser.find({ userId: article.authorId });

    //       if (article.rejectedCount === 3) {
    //         await article.destroy();

    //         if (recivers || recivers.length === 0) return;

    //         const messages =
    //           "Your article has been deleted because it has been rejected multiple times";

    //         recivers.forEach((reciver) => {
    //           io.to(reciver.socketId).emit("article-deleted", messages);
    //         });

    //         return;
    //       }

    //       const imgsName = extractImg(article.content);

    //       imgsName.push(article.banner);

    //       const gfs = MongoDB.gfs;

    //       let nsfw = false;

    //       let rejectedCount = article.rejectedCount;

    //       for (const imgName of imgsName) {
    //         if (nsfw) break;

    //         const files = await gfs.find({ filename: imgName }).toArray();

    //         if (!files || !files.length) {
    //           console.log("image not found");
    //           continue;
    //         }

    //         const readStream = gfs.openDownloadStreamByName(imgName);

    //         const chunks = [];

    //         readStream.on("data", (chunk) => {
    //           chunks.push(chunk);
    //         });

    //         readStream.on("end", () => {
    //           const imageData = Buffer.concat(chunks).toString("base64");
    //           clarifai(imageData, async (err, results) => {
    //             if (err) {
    //               console.log(err);
    //               return;
    //             }

    //             if (results[0].nsfw > 0.55) {
    //               nsfw = true;
    //               rejectedCount++;
    //               await article.update(
    //                 { status: "rejected", rejectedCount },
    //                 { hooks: false }
    //               );

    //               const messages =
    //                 "Our system has detected that your article includes sensitive images. This could be a mistake, and our staff or administrators will investigate it";

    //               recivers.forEach((reciver) => {
    //                 io.to(reciver.socketId).emit("article-rejected", messages);
    //               });

    //               return;
    //             }
    //           });
    //         });
    //       }
    //       await article.update({ status: "approved" }, { hooks: false });
    //     },
    //   },
  }
);

export default Article;
