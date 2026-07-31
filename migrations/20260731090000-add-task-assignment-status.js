"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TaskAssignments", "status", {
      type: Sequelize.ENUM("NOT_STARTED", "IN_PROGRESS", "COMPLETED"),
      allowNull: false,
      defaultValue: "NOT_STARTED",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("TaskAssignments", "status");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_TaskAssignments_status";',
    );
  },
};
