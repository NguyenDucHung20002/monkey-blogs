import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import User from "./User.js";

const Profile = sequelize.define(
  "Profile",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    avatar: { type: DataTypes.STRING, allowNull: false },

    fullname: { type: DataTypes.STRING, allowNull: false },

    bio: { type: DataTypes.STRING, allowNull: true },

    about: { type: DataTypes.TEXT, allowNull: true },

    followingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    followersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    unReadNotificationsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },

  {
    tableName: "profiles",
    timestamps: true,
    hooks: {
      afterCreate: async (article, options) => {
        const imgsName = extractImg(article.content);

        console.log(article.content);

        const gfs = MongoDB.gfs;

        let imgsData = [];

        // clarifai(imgData, (err, results) => {
        //   if (err) {
        //     console.log(err);
        //     reject(err);
        //   } else {
        //     resolve(results);
        //   }
        // });

        imgsData = await Promise.all(
          imgsName.map(async (imgName) => {
            try {
              const files = await gfs.find({ filename: imgName }).toArray();

              if (!files || !files.length) {
                console.log("image not found");
                return null;
              }

              const readStream = gfs.openDownloadStreamByName(imgName);

              const chunks = [];

              readStream.on("data", (chunk) => {
                chunks.push(chunk);
              });

              return new Promise((resolve, reject) => {
                readStream.on("end", () => {
                  const imgData = Buffer.concat(chunks).toString("base64");
                });
              });
            } catch (error) {
              console.error(error);
              return null;
            }
          })
        );

        console.log(resultCheck);
      },
    },
  }
);

export default Profile;
