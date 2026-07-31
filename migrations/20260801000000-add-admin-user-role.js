"use strict";

export default {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS \'ADMIN\';',
    );
  },

  async down() {
    // PostgreSQL does not safely support removing an ENUM value in place.
  },
};
