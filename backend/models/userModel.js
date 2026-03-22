const { sequelize } = require("../db/models/index.js");

const User = {
  // create new user
  create: async (email, hashedPassword, firstName, lastName) => {
    // Note: removed `id` because your DB uses auto-increment integers.
    // Note: removed `username` because it doesn't exist in your migration.
    const [rows] = await sequelize.query(
      `INSERT INTO users (
        email, 
        password, 
        "firstName", 
        "lastName", 
        "createdAt", 
        "updatedAt"
        ) 
       VALUES (
        :email, 
        :hashedPassword, 
        :firstName, 
        :lastName, 
        :createdAt, 
        :updatedAt
        ) 
       RETURNING *`,
      {
        replacements: {
          email,
          hashedPassword,
          firstName,
          lastName,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );
    return rows?.[0] ?? null;
  },

  // find user by email
  findByEmail: async (email) => {
    const [rows] = await sequelize.query(
      "SELECT * FROM users WHERE email = :email",
      {
        replacements: { email },
      },
    );
    return rows?.[0] ?? null;
  },

  // find user by id
  findById: async (id) => {
    const [rows] = await sequelize.query(
      `SELECT 
        id, 
        email, 
        "firstName", 
        "lastName", 
        "createdAt", 
        "updatedAt" 
      FROM users 
      WHERE id = :id`,
      {
        replacements: { id },
      },
    );
    return rows?.[0] ?? null;
  },
};

module.exports = User;