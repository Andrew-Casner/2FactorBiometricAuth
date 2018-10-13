const Sequelize = require('sequelize');
const sequelize = new Sequelize('EscrowSign', 'escrowsign', 'sdhacks2018', {
  host: 'escrowsign.c5otc3yhyeue.us-west-2.rds.amazonaws.com',
  dialect: 'postgres',

  pool: {
    max : 10,
    min : 1,
    idle : 2000
  }
});

module.exports = sequelize
