'use strict';


export default{
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable("tasks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      priority: {
        type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
        allowNull: false,
        defaultValue: "MEDIUM",
      },

      status: {
        type: Sequelize.ENUM(
          "NOT_STARTED",
          "IN_PROGRESS",
          "COMPLETED"
        ),
        allowNull: false,
        defaultValue: "NOT_STARTED",
      },

      projectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "RESTRICT",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable("tasks");
  },
  
};
