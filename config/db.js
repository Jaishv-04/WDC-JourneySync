const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Database connection parameters
const DB_NAME = process.env.DB_NAME || 'journeysync';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 1234;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3000;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST
);

module.exports = sequelize;