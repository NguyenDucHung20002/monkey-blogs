"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "topics",
      [
        {
          name: "Technology",
          followersCount: 100,
          articlesCount: 50,
          slug: "technology",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Science",
          followersCount: 80,
          articlesCount: 30,
          slug: "science",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Travel",
          followersCount: 120,
          articlesCount: 70,
          slug: "travel",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Food",
          followersCount: 90,
          articlesCount: 40,
          slug: "food",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Health",
          followersCount: 110,
          articlesCount: 60,
          slug: "health",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Art",
          followersCount: 70,
          articlesCount: 20,
          slug: "art",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Music",
          followersCount: 85,
          articlesCount: 45,
          slug: "music",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sports",
          followersCount: 150,
          articlesCount: 80,
          slug: "sports",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fashion",
          followersCount: 130,
          articlesCount: 55,
          slug: "fashion",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "History",
          followersCount: 75,
          articlesCount: 25,
          slug: "history",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("topics", null, {});
  },
};
