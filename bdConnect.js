const Sequelize = require("sequelize");
const sequelize = new Sequelize('story', 'postgres', '0000', {
  dialect: 'postgres',
  host: 'localhost',
  port: 4000
});

module.exports = sequelize;




