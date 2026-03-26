require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "ai_quest_dev", // 👈 עכשיו זה יפנה למקום הנכון!
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_TEST || "postgres_test",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};