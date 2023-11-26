"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];

    for (let i = 0; i < 1000; i++) {
      const email = faker.internet.email();

      users.push({
        username: `@${email.split("@")[0]}`,
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("users", users);

    const profiles = [];

    for (let i = 1; i <= 1000; i++) {
      profiles.push({
        fullname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        userId: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("profiles", profiles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("profiles", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
