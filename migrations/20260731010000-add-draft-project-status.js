"use strict";

export default {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Projects_status" ADD VALUE IF NOT EXISTS \'DRAFT\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE "Projects" ALTER COLUMN "status" SET DEFAULT \'DRAFT\';',
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Projects" ALTER COLUMN "status" SET DEFAULT \'ACTIVE\';',
    );
  },
};
