require('dotenv').config()
const config = {}
module.exports = {
  development :{
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
    url: process.env.DATABASE_URL,
  },
  qa :{
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
    url: process.env.DATABASE_URL,
  },
  production :{
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
    url: process.env.DATABASE_URL,
  }
}
