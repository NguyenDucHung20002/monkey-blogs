"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("report_articles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "articles",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },

      reason: {
        type: Sequelize.ENUM("Harassment", "Rules Violation", "Spam"),
        allowNull: true,
      },

      resolvedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },

      status: {
        type: Sequelize.ENUM("pending", "resolved"),
        allowNull: false,
        defaultValue: "pending",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("report_articles");
  },
};
