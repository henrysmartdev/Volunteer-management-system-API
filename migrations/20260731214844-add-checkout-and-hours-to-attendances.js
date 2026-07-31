"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Attendances", "checkOutAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Attendances", "totalHours", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Attendances", "checkOutAt");
    await queryInterface.removeColumn("Attendances", "totalHours");
  },
};
