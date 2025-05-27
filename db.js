const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: 'Photo_Caption_contest',
    user: 'postgres',
    password: 'andyandy',
    host: 'localhost',
    port: 5432,
    ssl: true,
    clientMinMessages: 'notice',
  });


module.exports = sequelize;
// delete???