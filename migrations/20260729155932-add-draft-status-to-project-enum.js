'use strict';

export default {
  async up (queryInterface, Sequelize) {
   
    // Add DRAFT to the enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_projects_status"
      ADD VALUE IF NOT EXISTS 'DRAFT';
    `);

      // Change the default value of the column
    await queryInterface.sequelize.query(`
      ALTER TABLE "projects"
      ALTER COLUMN "status"
      SET DEFAULT 'DRAFT';
    `);

  },

  async down (queryInterface, Sequelize) {
    
    // Revert the default
    await queryInterface.sequelize.query(`
      ALTER TABLE "projects"
      ALTER COLUMN "status"
      SET DEFAULT 'ACTIVE';
    `);
  }
};
