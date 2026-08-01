'use strict';


export default {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("assignments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      taskId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
        onDelete: "RESTRICT",
      },

      volunteerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "RESTRICT",
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
    await queryInterface.addConstraint("assignments", {
      fields: ["taskId", "volunteerId"],
      type: "unique",
      name: "unique_task_volunteer_assignment",
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable("assignments");
  }
};
