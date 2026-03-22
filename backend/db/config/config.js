require('dotenv').config();


module.exports = {
  development: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "postgres",
    host: "localhost",
    dialect: "postgres"
  },
  test: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "postgres",
    host: "localhost",
    dialect: "postgres"
  },
  production: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "postgres",
    host: "localhost",
    dialect: "postgres"
  }
};