"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TaskAssignments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      taskId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      volunteerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      assignedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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

    // Prevent duplicate assignments
    await queryInterface.addConstraint("TaskAssignments", {
      fields: ["taskId", "volunteerId"],
      type: "unique",
      name: "unique_task_volunteer_assignment",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("TaskAssignments");
  },
};
