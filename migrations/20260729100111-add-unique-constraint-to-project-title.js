'use strict';

export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("projects", {
      fields: ["title"],
      type: "unique",
      name: "unique_project_title",
       });
    
  },

  async down (queryInterface, Sequelize) {
       
    await queryInterface.removeConstraint(
      "projects",
      "unique_project_title"
    );
   
  }
};
