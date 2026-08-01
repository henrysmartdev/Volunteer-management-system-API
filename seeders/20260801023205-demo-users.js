'use strict';
import bcrypt from "bcrypt";

const coordinatorId = "66666666-1111-1111-1111-111111111111";

const volunteer1Id = "22222222-2222-2222-2222-222222222222";
const volunteer2Id = "33333333-3333-3333-3333-333333333333";
const volunteer3Id = "44444444-4444-4444-4444-444444444444";

export default {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(
        "Password123!",
        10
    );
    await queryInterface.bulkInsert("Users", [
       {
        id: coordinatorId,
        firstName: "John",
        lastName: "Coordinator",
        email: "john@example.com",
        password: hashedPassword,
        role: "COORDINATOR",
        avatar: null,
        avatarPublicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: volunteer1Id,
        firstName: "Mary",
        lastName: "Johnson",
        email: "mary@example.com",
        password: hashedPassword,
        role: "VOLUNTEER",
        avatar: null,
        avatarPublicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: volunteer2Id,
        firstName: "David",
        lastName: "James",
        email: "david@example.com",
        password: hashedPassword,
        role: "VOLUNTEER",
        avatar: null,
        avatarPublicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: volunteer3Id,
        firstName: "Sarah",
        lastName: "King",
        email: "sarah@example.com",
        password: hashedPassword,
        role: "VOLUNTEER",
        avatar: null,
        avatarPublicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },


 

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete("Users", {
      id: [
        coordinatorId,
        volunteer1Id,
        volunteer2Id,
        volunteer3Id,
      ],
    });

  }
};
