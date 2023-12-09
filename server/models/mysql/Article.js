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
    hooks: {
      afterUpdate: async (article, options) => {
        const imgsName = extractImg(article.content);

        imgsName.push(article.banner);

        const gfs = MongoDB.gfs;

        let array = [];

        await Promise.all(
          imgsName.map(async (imgName) => {
            const files = await gfs.find({ filename: imgName }).toArray();

            if (!files || !files.length) {
              console.log(`Image not found: ${imgName}`);
            }

            const readStream = gfs.openDownloadStreamByName(imgName);
            const chunks = [];

            await new Promise((resolve, reject) => {
              readStream.on("data", (chunk) => chunks.push(chunk));

              readStream.on("end", () => {
                const imageData = Buffer.concat(chunks).toString("base64");
                array.push(imageData);
                resolve();
              });

              readStream.on("error", (error) => {
                reject(error);
              });
            });
          })
        );

        clarifai(array, async (err, results) => {
          if (err) {
            console.log(err);
            return;
          }

          const nsfwFound = results.some((data) =>
            data.some((val) => "nsfw" in val && val.nsfw > 0.55)
          );

          const io = socket.getIO();

          if (nsfwFound) {
            const [recivers] = await Promise.all([
              SocketUser.find({ userId: article.authorId }),
              article.update(
                {
                  status: "rejected",
                  rejectedCount: article.rejectedCount + 1,
                },
                { hooks: false }
              ),
              Profile.increment(
                { unReadNotificationsCount: 1 },
                { where: { id: article.authorId } }
              ),
            ]);

            if (recivers.length > 0) {
              const message =
                "We've detected explicit content in your article, which is not allowed. Our team will investigate. Please be patient";
              recivers.forEach((reciver) => {
                io.to(reciver.socketId).emit("article-rejected", message);
              });
            }
          } else {
            const [recivers] = await Promise.all([
              SocketUser.find({ userId: article.authorId }),
              article.update(
                {
                  status: "approved",
                  rejectedCount: article.rejectedCount + 1,
                },
                { hooks: false }
              ),
              Profile.increment(
                { unReadNotificationsCount: 1 },
                { where: { id: article.authorId } }
              ),
            ]);
            if (recivers.length > 0) {
              const message =
                "Your article has been approved. You can now view it";

              recivers.forEach((reciver) => {
                io.to(reciver.socketId).emit("article-rejected", message);
              });
            }
          }
        });
      },
    },
  }
);

export default Article;
