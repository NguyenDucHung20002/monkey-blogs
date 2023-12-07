import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import User from "./User.js";
import extractImg from "../../utils/extractImg.js";
import MongoDB from "../../databases/mongodb/connect.js";
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

    rejectedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM("draft", "approved", "rejected"),
      allowNull: false,
      defaultValue: "draft",
    },
  },

  {
    tableName: "articles",
    timestamps: true,
    hooks: {
      afterUpdate: async (article, options) => {
        const imgsName = extractImg(article.content);

        const gfs = MongoDB.gfs;

        let imgsData = [];

        const promises = imgsName.map(async (imgName) => {
          const files = await gfs.find({ filename: imgName }).toArray();

          if (!files || !files.length) {
            console.log("image not found");
            return null;
          }

          return new Promise((resolve, reject) => {
            const readStream = gfs.openDownloadStreamByName(imgName);
            const chunks = [];

            readStream.on("data", (chunk) => {
              chunks.push(chunk);
            });

            readStream.on("end", () => {
              const imageData = Buffer.concat(chunks).toString("base64");
              imgsData.push({ data: { image: { base64: imageData } } });
              resolve();
            });

            readStream.on("error", (err) => {
              reject(err);
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            clarifai(imgsData, (err, results) => {
              if (err) {
                console.log(err);
                // reject(err);
              } else {
                console.log(imgsData);
                // resolve(results);
                console.log(results);
              }
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        // imgsName.forEach(async (imgName) => {
        //   const files = await gfs.find({ filename: imgName }).toArray();

        //   if (!files || !files.length) {
        //     console.log("image not found");
        //     return null;
        //   }

        //   const readStream = gfs.openDownloadStreamByName(imgName);

        //   const chunks = [];

        //   readStream.on("data", (chunk) => {
        //     chunks.push(chunk);
        //   });

        //   readStream.on("end", () => {
        //     imgsData.push(Buffer.concat(chunks).toString("base64"));
        //   });
        // });

        // clarifai(imgData, (err, results) => {
        //   if (err) {
        //     console.log(err);
        //     reject(err);
        //   } else {
        //     resolve(results);
        //   }
        // });
      },
    },
  }
);

export default Article;
