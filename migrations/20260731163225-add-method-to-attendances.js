"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Attendances", "method", {
      type: Sequelize.ENUM("QR", "MANUAL"),
      allowNull: false,
      defaultValue: "QR",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Attendances", "method");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Attendances_method";',
    );
  },
};
